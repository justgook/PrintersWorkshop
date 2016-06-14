#!/bin/bash
set -o errexit -o nounset


# if [ "$TRAVIS_BRANCH" != "master" ]
# then
#   echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
#   exit 0
# fi


cd dist
git init
git config user.name "Travis-CI"
git config user.email "justgook@gmail.com"
git add .
git commit -m "Deployed to Github Pages"
git push --force --quiet "https://${GH_TOKEN}@github.com/justgook/PrintersWorkshopUI.git" master:gh-pages #> /dev/null 2>&1




