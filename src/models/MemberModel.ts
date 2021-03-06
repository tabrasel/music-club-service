// Import modules
import express, { Response } from 'express';
import mongoose, { Document, NativeError, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import IMember from '../interfaces/IMember';

class MemberModel {

  private static model: mongoose.Model<IMember>;

  public static setup(): void {
    // Define member schema
    const schema: mongoose.Schema = new mongoose.Schema(
      {
        id: String,
        firstName: String,
        lastName: String,
        color: String,
        participatedRoundIds: [String],
        postedAlbumIds: [String]
      },
      { collection: 'members' }
    );

    // Compile member model from schema
    this.model = mongoose.model<IMember>('Member', schema);
  }

  /**
   * Creates a member in the database.
   * @param firstName first name
   * @param lastName  last name
   * @param color     color
   * @return the created member
   */
  public static async create(firstName: string, lastName: string, color: string) {
    // Define member document
    const memberDoc: IMember = {
      id: uuidv4(),
      firstName,
      lastName,
      color,
      participatedRoundIds: [],
      postedAlbumIds: []
    }

    // Create member in database
    const createdMember: IMember = await this.model.create(memberDoc);

    return Promise.resolve(createdMember);
  }

  /**
   * Updates a member.
   * @param id ID of the member to update
   * @return the updated member
   */
  public static async update(id: string, updateData: any): Promise<IMember> {
    const updatedMember: IMember = await this.model.findOneAndUpdate({ id }, updateData, { new: true, useFindAndModify: false });
    return Promise.resolve(updatedMember);
  }

  /**
   * Deletes a member.
   * @param id ID of the member to delete
   * @return the deleted member
   */
  public static async delete(id: string): Promise<IMember> {
    const deletedMember: IMember = await this.model.findOneAndDelete({ id });
    return Promise.resolve(deletedMember);
  }

  /**
   * Gets a member.
   * @param id ID of the member to get
   * @return the specified member
   */
  public static async get(id: string): Promise<IMember> {
    const foundMember: IMember = await this.model.findOne({ id }).lean();
    return Promise.resolve(foundMember);
  }

  /**
   * Gets all members.
   */
  public static async getAll(): Promise<IMember[]> {
    const allMembers: IMember[] = await this.model.find({}).lean();
    return Promise.resolve(allMembers);
  }

  public static getModel() {
    return this.model;
  }

  public static async sortMemberIds(memberIds: string[]): Promise<any> {
    // Get members
    const query = this.model.find({ 'id': { $in: memberIds } });
    const members: IMember[] = await query.exec();

    // Sort members by name
    members.sort((a: IMember, b: IMember) => this.compareMembers(a, b));

    // Map sorted members back to member IDs
    const sortedMemberIds: string[] = members.map((m: IMember) => m.id);

    return sortedMemberIds;
  }

  private static compareMembers(a: IMember, b: IMember): number {
    if (a.lastName < b.lastName)
      return -1;
    else if (a.lastName > b.lastName)
      return 1;
    return a.firstName < b.firstName ? -1 : 1;
  }

}

export { MemberModel };
