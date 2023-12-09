echo "Installing yarn"
npm install --global yarn

echo "Installing root dependencies"
yarn

echo "Installing backend dependencies"
cd ./backend
yarn

echo "Installing frontend dependencies"
cd ../frontend
yarn

cd ../