export enum NodeEnvEnum {
  LOCAL = 'local',
  DEV = 'dev',
  PRE = 'pre',
  PRO = 'pro'
}

export type TNodeEnv = `${NodeEnvEnum}`