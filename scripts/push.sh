#!/bin/bash

set -e

git status

git add -A

git commit -m "$1"

git push origin master

