const { setupServer } = require("./app");
const app = setupServer();

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`We are lisning ${port}`);
});
