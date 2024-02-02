rm -rf build
mkdir build
mkdir build/public
npm run build
cp -R frontend/dist/* build/public
cp -R frontend/static_files/* build/public
cp data/data.json build/public

scp -r <<PATH TO YOUR PROJECT FOLDER>>interview/build/public/* <<>USER>@<<SERVER>>:<<SERVER_PROJECT_PATHG>>/interview/public

echo "done. visit: <<YOUR URL>>"