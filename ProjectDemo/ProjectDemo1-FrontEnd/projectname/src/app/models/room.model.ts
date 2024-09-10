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
    id?: number;
    staffName?: string;
    email?: string;
    contact?: number;
    address?: string;
    rating?: number;
    isAvailable?: string;
    aadhar?: number;
    imagePath?: string;
    joinedDate?: Date;
    imageData?: File;
  }
  
  