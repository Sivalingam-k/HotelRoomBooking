export interface Room {
    id: number;
    roomNumber: number;
    roomType: string;
    price: number;
    ISAvailable: boolean;
    imagePath?: string;
    bathRoom:string; 
    hall:string; 
    bedRoom:string; 
    editMode?: boolean; 
    rating :number;
    location:string; 
    description:string,
    amenities?: string;
}
export class RoomService {
    Id?: number;
    StaffName?: string;
    Email?: string;
    Contact?: number;
    Address?: string;
    Rating?: number;
    IsAvailable?: string;
    Aadhar?: number;
    ImagePath?: string;
    JoinedDate?: Date;
  }
  
  