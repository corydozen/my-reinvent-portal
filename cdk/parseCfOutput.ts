import { readFileSync, writeFile } from "fs";
import { config } from "./config";

interface Outputs {
  userpoolid: string;
  webclientid: string;
  identitypoolid: string;
  rdsaddress: string;
  rdsport: string;
  apiurl: string;
  apiname: string;
  uploadbucket: string;
}

interface Stack {
  Outputs: Outputs;
}

interface CfnOutput {
  Stacks: Stack[];
}

interface FrontEndConfig {
  apiurl: string;
  UserPoolId: string;
  UserPoolClientId: string;
  region: string;
}

const findOutput = (cfoutput: any, key: string) => {
  const output = cfoutput.Stacks[0].Outputs.find(
    (o: any) => o.OutputKey === key
  );
  if (output) {
    return output.OutputValue;
  }
  return "";
};

const outputTxt = readFileSync(`${__dirname}/cloudformationoutput.json`, {
  encoding: "utf-8",
});
const output = JSON.parse(outputTxt) as CfnOutput;

const frontEndConfig: FrontEndConfig = {
  UserPoolClientId: findOutput(output, "webclientid"),
  UserPoolId: findOutput(output, "userpoolid"),
  apiurl: findOutput(output, "apiurl"),
  region: config.region,
};
const configtxt = `// This is an auto generated file. Any edits will be overwritten\nexport const config = ${JSON.stringify(
  frontEndConfig
)};`;

writeFile(`${__dirname}/../src/config.ts`, configtxt, err => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log("config file saved!");
});
