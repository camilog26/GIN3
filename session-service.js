import { db } from '../config/firebase-config.js';
import { teamService } from './team-service.js';
import { 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    deleteDoc, 
    updateDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js";

class SessionService {
    constructor() {
        this.sessionsCollection = collection(db, 'sessions');
    }

    async login(accessCode) {
        try {
            const teamVerification = await teamService.verifyAccessCode(accessCode);
            
            if (!teamVerification.success) {
                return teamVerification;
            }

            const sessionData = {
                teamId: teamVerification.teamId,
                loginTime: serverTimestamp(),
                lastActivity: serverTimestamp()
            };

            const sessionDoc = await addDoc(this.sessionsCollection, sessionData);

            // Guardar datos de sesión en localStorage
            localStorage.setItem('sessionId', sessionDoc.id);
            localStorage.setItem('teamId', teamVerification.teamId);

            return {
                success: true,
                teamData: teamVerification.teamData
            };
        } catch (error) {
            console.error('Error in login:', error);
            throw new Error('Error al iniciar sesión');
        }
    }

    async checkActiveSession() {
        const sessionId = localStorage.getItem('sessionId');
        const teamId = localStorage.getItem('teamId');

        if (!sessionId || !teamId) {
            return { active: false };
        }

        try {
            const sessionDocRef = doc(db, 'sessions', sessionId);
            const sessionDoc = await getDoc(sessionDocRef);
            
            if (!sessionDoc.exists()) {
                this.logout();
                return { active: false };
            }

            // Actualizar última actividad
            await updateDoc(sessionDocRef, {
                lastActivity: serverTimestamp()
            });

            const teamData = await teamService.getTeamData(teamId);
            return {
                active: true,
                teamData
            };
        } catch (error) {
            console.error('Error checking session:', error);
            this.logout();
            return { active: false };
        }
    }

    async logout() {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                await deleteDoc(doc(db, 'sessions', sessionId));
            } catch (error) {
                console.error('Error deleting session:', error);
            }
        }
        localStorage.removeItem('sessionId');
        localStorage.removeItem('teamId');
    }
}

export const sessionService = new SessionService();