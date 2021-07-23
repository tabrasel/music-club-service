// Import modules
import express, { Response } from 'express';
import mongoose, { Document, Model, NativeError, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define round interface
interface IRound {
  id: string,
  number: number,
  albumIds: string[],
  startDate: string,
  endDate: string,
  picksPerParticpant: number
}

class RoundModel {

  private static model: Model<IRound>;

  public static setup(): void {
    // Define round schema
    const schema: Schema = new Schema(
      {
        id: String,
        number: Number,
        albumIds: [String],
        startDate: String,
        endDate: String,
        picksPerParticpant: Number
      },
      { collection: 'rounds' }
    );

    // Compile round model
    this.model = model<IRound>('Round', schema);
  }

  /**
   * Create a new round document.
   */
  public static createRound(req: any, res: Response): void {
    // Define a document for the round
    const roundInfo = req.body;
    const roundDoc: IRound = {
      id: uuidv4(),
      number: roundInfo.number,
      albumIds: [],
      startDate: roundInfo.startDate,
      endDate: roundInfo.endDate,
      picksPerParticpant: roundInfo.picksPerParticpant,
    }

    // Create the round document in the database
    this.model.create(roundDoc, (err: NativeError, round: Document) => {
      if (err) {
        res.json("Failed to create round");
      } else {
        res.json(round);
      }
    });
  }

  /**
   * Get a specified round from the database.
   */
  public static getRound(req: any, res: Response): void {
    const query: any = this.model.findOne(req.query);
    query.exec((err: NativeError, round: Document) => {
      if (err) {
        res.json("Failed to get round");
      } else {
        res.json(round);
      }
    });
  }

  /**
   * Get all rounds.
   */
  public static getAllRounds(res: any): any {
    const query = this.model.find({});
    query.exec((err, rounds) => {
      if (err) res.json("Failed to get all rounds");
      res.json(rounds);
    });
  }

}

export { RoundModel };
