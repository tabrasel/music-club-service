// Import modules
import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define interface
interface IClub {
  id: string,
  name: string,
  currentRoundId: string,
  participantIds: string[],
  roundIds: string[]
}

class ClubModel {

  private static model: mongoose.Model<IClub>;

  public static setup(): void {
    // Define schema
    const schema: mongoose.Schema = new mongoose.Schema(
      {
        id: String,
        name: String,
        currentRoundId: String,
        participantIds: [String],
        roundIds: [String]
      },
      { collection: 'clubs' }
    );

    // Compile model from schema
    this.model = mongoose.model<IClub>('Club', schema);
  }

  /**
   * Create a new club document in the database.
   */
  public static createClub(req: any, res: Response): void {
    // Define a document for the club
    const clubInfo = req.body;
    const clubDoc: IClub = {
      id: uuidv4(),
      name: clubInfo.name,
      currentRoundId: null,
      participantIds: [],
      roundIds: []
    }

    // Create the club document in the database
    this.model.create(clubDoc, (err: NativeError, club: Document) => {
      if (err) {
        res.json("Failed to create club");
      } else {
        res.json(club);
      }
    });
  }

  /**
   * Update an existing club.
   */
  public static updateClub(req: any, res: Response): any {
    const filter: any = { id: req.query.id };
    const updatedData: any = req.body;

    const query = this.model.findOneAndUpdate(
      filter,
      updatedData,
      { new: true, useFindAndModify: false }
    );

    query.exec((err: NativeError, updatedClub) => {
      if (err) {
        res.json("Failed to update club");
      } else {
        res.json(updatedClub);
      }
    });
  }

  /**
   * Delete an existing club.
   */
  public static deleteClub(req: any, res: Response): any {
    const query: any = this.model.findOneAndDelete(req.query);

    query.exec((err: NativeError, club: Document) => {
      if (err) {
        res.json("Failed to delete club");
      } else {
        res.json(club);
      }
    });
  }

  /**
   * Get a specified club.
   */
  public static getClub(req: any, res: Response): void {
    const query: any = this.model.findOne(req.query);
    query.exec((err: NativeError, club: Document) => {
      if (err) {
        res.json("Failed to get club");
      } else {
        res.json(club);
      }
    });
  }

  /**
   * Get all clubs.
   */
  public static getAllClubs(res: any): any {
    const query = this.model.find({});
    query.exec((err, clubs) => {
      if (err) res.json("Failed to get all clubs");
      res.json(clubs);
    });
  }

  public static getModel() {
    return this.model;
  }

}

export { ClubModel };