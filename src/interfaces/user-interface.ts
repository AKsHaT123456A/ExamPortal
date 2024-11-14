export interface IUser extends Document {
    email: string;
    gender: 'Female' | 'Male';
    isHosteler: boolean;
    isVerified: boolean;
    name: string;
    mobileNo: string;
    studentNo: string;
    responses: { score: number }[]; 
    password: string;
    logintime: number;
    isRelogin: boolean;
    isSubmit: boolean;
    category?: string;
    calculatedTotalScore: number;
}
