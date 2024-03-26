import { Request, Response } from 'express'

export const HealthCheck = async (_req: Request, res: Response) => {
  try {
    res.status(200).json({
      status: 200,
      message: 'Health Check!'
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: JSON.stringify(error),
    })
  }
}
