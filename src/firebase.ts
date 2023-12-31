import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import type { Unsubscribe, User } from 'firebase/auth';
import { getFirestore, onSnapshot, doc, setDoc } from 'firebase/firestore';
import router from '@/router'
import { UserInfo } from '@/classes';

export default class Firebase {
	// Initialize Firebase.
	public static app = initializeApp({
		apiKey: "AIzaSyBaLD1GaazsOtwlRd41AbDGFbFs30dn0pA",
		authDomain: "degreebuilder-bb72e.firebaseapp.com",
		projectId: "degreebuilder-bb72e",
		storageBucket: "degreebuilder-bb72e.appspot.com",
		messagingSenderId: "919045284880",
		appId: "1:919045284880:web:c3ecdf12397d470ed79695"
	});
	// Initialize Firebase Authentication
	public static auth = getAuth(this.app);
	private static fireStoreUnsubscribe: Unsubscribe | undefined;
	// Initialize Firestore.
	public static db = getFirestore(this.app);
	
	public static user = ref(null) as Ref<User | null>;
	public static dataBase: UserInfo = reactive(new UserInfo());
	public static isLoading = ref(true) as Ref<boolean>;
	
	static fireStorePath = '';
	
	// Listen to the auth state
	private static authUnsubscribe = onAuthStateChanged(this.auth, async (user) => {
		this.user.value = user;
		if(this.user.value){
			this.fireStorePath = `${this.user.value.uid}/Degree`;
			this.getUserData();
		}else{
			this.fireStoreUnsubscribe?.();
			this.fireStoreUnsubscribe = undefined
			Object.assign(this.dataBase, {})
			router.push({name: 'Login'});
			this.isLoading.value = false;
		}
	});
	
	/**
	 * 
	 * @returns True if password reset email was sent, false otherwise
	 */
	static async resetPassword(): Promise<boolean>{
		if(!this.auth.currentUser){
			return false
		}
		try {
			await sendPasswordResetEmail(this.auth, this.auth.currentUser.email as string);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Update the DashBooks Data
	 * @param fireStore
	 */
	static async updateDataBase(fireStore = this.dataBase): Promise<void>{
		if(!this.user.value || this.fireStorePath === ''){
			return;
		}

		const data = JSON.parse(JSON.stringify(fireStore))

		await setDoc(doc(this.db, this.fireStorePath), {
			...data
		})
	}

	/**
	 * Sets up a snapshot to listen to the user's DashBooks Data
	 */
	static async getUserData(): Promise<void>{
		if(!this.user.value || this.fireStorePath === ''){
			return;
		}

		this.fireStoreUnsubscribe?.();
		this.fireStoreUnsubscribe = undefined
		
		this.fireStoreUnsubscribe = onSnapshot(doc(this.db, this.fireStorePath), async (doc) => {
			const data = doc.data();
			if(data === undefined || Object.keys(data).length <= 0){
				this.updateDataBase(new UserInfo())
			}else{
				Object.assign(this.dataBase, data)
				console.log(this.dataBase)
				this.checkSave();
				this.isLoading.value = false;
			}
		});
	}

	/**
	 * Checks the save to ensure it's up to date.
	 */
	static async checkSave(): Promise<void>{
		
	}
}