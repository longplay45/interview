rm -rf build
mkdir build
mkdir build/public
npm run build
cp -R frontend/dist/* build/public
cp -R frontend/static_files/* build/public
cp data/data.json build/public

#scp -r <<PATH TO YOUR PROJECT FOLDER>>interview/build/public/* <<>USER>@<<SERVER>>:<<SERVER_PROJECT_PATHG>>/interview/public

scp -r $HOME/Docs/Dev/Data/projects/interview/build/public/* i@artificial-interactions.com:/home/i/www/dev.lp45.net/interview/public

echo "done. visit: [https://interview.dev.lp45.net/]"