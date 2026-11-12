import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface SetRoleData {
  uid: string;
  role: string;
}

export const setCustomClaims = functions.https.onCall<SetRoleData, any>(async (request) => {
  // 1. Verificar que el usuario que llama está autenticado
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Solo usuarios autenticados pueden acceder.');
  }

  // 2. Verificar que el usuario que llama es super_admin
  const callerClaims = request.auth.token;
  if (callerClaims.role !== 'super_admin') {
    throw new functions.https.HttpsError('permission-denied', 'Solo los super administradores pueden asignar roles.');
  }

  const { uid, role } = request.data;

  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Se requieren uid y role.');
  }

  const validRoles = ['super_admin', 'admin', 'editor', 'moderator', 'viewer'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Rol no válido.');
  }

  try {
    // 3. Asignar el custom claim
    await admin.auth().setCustomUserClaims(uid, { role });
    return { success: true, message: `Rol '${role}' asignado exitosamente al usuario ${uid}` };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError('internal', 'Error al asignar el rol.');
  }
});
