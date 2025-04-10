require("dotenv").config();

const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const JWT = process.env.JWT || "shhh";
//will need this for authentication later ^
