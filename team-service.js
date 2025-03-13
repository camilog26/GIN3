import { db } from '../config/firebase-config.js';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    doc, 
    getDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js";

class TeamService {
    constructor() {
        this.teamsCollection = collection(db, 'teams');
    }

    async registerTeam(teamData) {
        try {
            const accessCode = this.generateAccessCode();
            const teamDoc = await addDoc(this.teamsCollection, {
                ...teamData,
                accessCode,
                registrationDate: serverTimestamp(),
                status: 'active'
            });

            return {
                success: true,
                teamId: teamDoc.id,
                accessCode
            };
        } catch (error) {
            console.error('Error registering team:', error);
            throw new Error('Error al registrar el equipo');
        }
    }

    async verifyAccessCode(accessCode) {
        try {
            const q = query(
                this.teamsCollection,
                where('accessCode', '==', accessCode),
                where('status', '==', 'active')
            );
            
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { success: false, message: 'Código inválido' };
            }

            const teamDoc = querySnapshot.docs[0];
            return {
                success: true,
                teamId: teamDoc.id,
                teamData: teamDoc.data()
            };
        } catch (error) {
            console.error('Error verifying access code:', error);
            throw new Error('Error al verificar el código');
        }
    }

    generateAccessCode() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        return code;
    }

    async getTeamData(teamId) {
        try {
            const teamDoc = await getDoc(doc(db, 'teams', teamId));
            if (!teamDoc.exists()) {
                throw new Error('Equipo no encontrado');
            }
            return teamDoc.data();
        } catch (error) {
            console.error('Error getting team data:', error);
            throw new Error('Error al obtener datos del equipo');
        }
    }
}

export const teamService = new TeamService();