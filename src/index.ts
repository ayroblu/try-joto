import JotoAPI from 'joto-api'
import 'dotenv/config'
import fs from 'fs';
import { convertSvg } from './convert-svg.js';

const username = process.env.USERNAME
const password = process.env.PASSWORD
if (!username) throw new Error('username not defined')
if (!password) throw new Error('password not defined')

const drawSVG = async (svgIn: string) => {
  const svg = await convertSvg(svgIn)
  await JotoAPI.login(username, password);
  await JotoAPI.selectJoto();
  await JotoAPI.drawSVG(svg);
};

const args = process.argv.slice(2);
if (args.length < 1) {
  throw new Error('Please pass an svg file path as an argument')
}
const filepath = args[0];

const svg = fs.readFileSync(filepath, 'utf8');

drawSVG(svg).catch(console.error);
