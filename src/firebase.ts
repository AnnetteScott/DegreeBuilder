import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import type { Unsubscribe, User } from 'firebase/auth';
import { getFirestore, onSnapshot, doc, setDoc } from 'firebase/firestore';
import router from '@/router'

export default class Firebase {
	// Initialize Firebase.
	public static app = initializeApp({
		
	});
	// Initialize Firebase Authentication
	public static auth = getAuth(this.app);
	private static fireStoreUnsubscribe: Unsubscribe | undefined;
	// Initialize Firestore.
	public static db = getFirestore(this.app);
	
	public static user = ref(null) as Ref<User | null>;
	public static dataBase = reactive({});
	public static isLoading = ref(true) as Ref<boolean>;
	
	static fireStorePath = '';
	
	// Listen to the auth state
	private static authUnsubscribe = onAuthStateChanged(this.auth, async (user) => {
		this.user.value = user;
		
		if(this.user.value){
			this.fireStorePath = `Users/${this.user.value.uid}/`
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
			data
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
			if(data === undefined){
				this.updateDataBase({})
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