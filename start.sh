#!/usr/bin/env bash

set -e

setup_profile=

help() {
  echo "Usage:"
  echo "  $(basename $0) [--setup-profile]"
  echo "Starts an instance of the browser with the in-development extension installed"
  echo "Uses profile in ./Profile that is copied anew each time."
  echo "Use $(basename $0) --setup-profile to setup your profile (e.g., log into services)"
}

if [[ -z "$(which web-ext)" ]] ; then
  echo "Install web-ext to continue:"
  echo "npm install -g web-ext"
  exit 2
fi

binary=
firefoxes="
/Applications/FirefoxNightly.app
/Applications/FirefoxDeveloperEdition.app
/Applications/FirefoxAurora.app
$(which firefox || true)
"
for firefox in $firefoxes ; do
  if [[ -e "$firefox" ]] ; then
    binary="$firefox"
    break
  fi
done
open=$binary # assumes Linux
unamestr=$(uname)
if [[ "$unamestr" = "Darwin" ]]; then
  open="open $binary"
fi

while [[ -n "$1" ]] ; do
  case "$1" in
    help|-h|--help)
      help
      exit
      ;;
    --setup-profile)
      setup_profile=1
      shift
      ;;
    *)
      echo "Error: unexpected argument $1"
      help
      exit 1
      ;;
  esac
done

if [[ ! -d ./Profile ]] ; then
  echo "NOTE: you must setup a Firefox profile in ./Profile/"
  echo -n "Press ENTER to continue (^C to abort) ... "
  read
  setup_profile=1
fi

if [[ -n "$setup_profile" ]] ; then
  profile_dir="$(pwd)/Profile"
  if [[ -d "$profile_dir" ]] ; then
    echo "Using existing profile in $profile_dir running:"
    echo " " $open -n --args -new-instance -no-remote -profile "$profile_dir"
    $open -n --args -new-instance -no-remote -profile "$profile_dir"
  else
    echo "Creating profile in $profile_dir running:"
    echo " " $open -n --args -new-instance -no-remote -CreateProfile "ScreenshotsTestProfile $profile_dir"
    $open -n --args -new-instance -no-remote -CreateProfile "ScreenshotsTestProfile $profile_dir"
    echo "Opening profile running:"
    echo " " $open -n --args -new-instance -no-remote -profile "$profile_dir"
    $open -n --args -new-instance -no-remote -profile "$profile_dir"
  fi
  exit
fi

web-ext run -f $binary --bc --firefox-profile ./Profile/
