

/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";
rhit.fbLoginManager = null;
rhit.fbHomeManager = null;
rhit.fbGroupsManager = null;
rhit.fbJournalEntriesManager = null;
rhit.fbSoundsManager = null;

rhit.badVariable = null;

rhit.FB_COLLECTION_JOURNAL = "JournalEntry";
rhit.FB_KEY_DATE = "date";
rhit.FB_KEY_RATING = "Rating";
rhit.FB_KEY_AUTHOR = "Author";
rhit.FB_KEY_ENTRY = "Entry";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};


rhit.JournalEntry = class {
	constructor(id, date, rating, entry){
		this.id = id;
		this.date = date;
		this.rating = rating;
		this.entry = entry;
	}
}

rhit.JournalEntriesManager = class {
	constructor(uid){
		this.__uid = uid;
		this._documentSnapshots = [];
		rhit.fbAuthManager.getFirebaseId()
		.then((id) => {
			this._ref = firebase.firestore().collection('users').doc(id).collection('journalEntries');
		})
		//this._ref = this._ref.doc(id).collection('journalEntries');
	}

	add(entry, rating, date){		

		rhit.badVariable = this._ref.add({
			[rhit.FB_KEY_ENTRY]: entry,
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_DATE]: date,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now()

		})
		.then(function(docRef){
			console.log("Doc written with ID: ", docRef.id);
		})
		.catch(function(error){
			console.error("Error adding doc: ", error);
		})

	}

	beginListening(changeListener) {
		let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50)
		if(this._uid){
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this.uid);
		}
		this._unsubscribe = query
		.onSnapshot((querySnapshot) => {

			this._documentSnapshots = querySnapshot.docs;
	

			changeListener();

		});
	}
	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}
	getJournalAtDate(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_ENTRY),
			docSnapshot.get(rhit.FB_KEY_DATE),
			docSnapshot.get(rhit.FB_KEY_RATING)
		);
		return mq;
	}
	createCard(entry, date){
		var card = document.createElement('div');
		card.id = date;
		card.className = 'card';
		var header = document.createElement('h2');
		header.textContent = date;
		var textElement = document.createElement('p');
		textElement.textContent = date;
		card.appendChild(textElement);
		var container = document.getElementById('container');
		container.appendChild(card);

		card.addEventListener('click', (event) => {
			console.log("click")
			// Prevent editing when clicking inside the text element
			if (event.target === textElement) {
				return;
			}

			// Disable editing when clicking outside the text element
			textElement.contentEditable = false;
		});
	}

	
}

rhit.AuthManager = class {
	constructor() {
	  this._user = null;
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			if(user){
				let isInDataBase = false;
				firebase.firestore().collection('users').where('email', '==', user.email).get()
				.then((querySnapshot) =>{
					querySnapshot.forEach((doc) => {
						isInDataBase = true;
					});
					if(!isInDataBase){
						this.addUserToDatabase();
					}
				})
				console.log("signed in");
			}
			else
				console.log("not signed in");

			changeListener();
		});
	}
	signOut() {
		firebase.auth().signOut().catch((e) => {
			console.log("Error");
		});
	}
	addUserToDatabase(){
		let userObject = {
			email: this._user.email,
			groups: []
		};
		firebase.firestore().collection('users').add(userObject)
	}
	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}
	get displayName(){
		return this._user.displayName;
	}
	get isAnonymous(){
		return this._user.isAnonymous;
	}
	async getuserObject(){
		let ob;
		await firebase.firestore().collection('users').where('email', '==', this._user.email).get()
		.then((querySnapshot) =>{
			querySnapshot.forEach((doc) => {
				 ob = doc.data();
			});
		})
		return ob;
	}
	async getFirebaseId(){
		let ob;
		await firebase.firestore().collection('users').where('email', '==', this._user.email).get()
		.then((querySnapshot) =>{
			querySnapshot.forEach((doc) => {
				 ob = doc.id;
			});
		})
		return ob;
	}
}

rhit.GroupsManager = class {
	constructor(uid){
		this._uid = uid;
		this._ref = firebase.firestore().collection('groups');
	}

	addGroup(group){
		// TODO: Get id of group
		// add group to users
		// add user to group
		this._ref.add({
			['users']: users,
		})
		.then(function(docRef){
			console.log("Doc written with ID: ", docRef.id);
		})
		.catch(function(error){
			console.error("Error adding doc: ", error);
		})
	}

	addPost(){

	}

	beginListening(changeListener) {
		query = this._ref.where(rhit.FB_KEY_AUTHOR, "==", this.uid);
		this._unsubscribe = query
		.onSnapshot((querySnapshot) => {
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}
	stopListening() {
		this._unsubscribe();
	}

	async updategroupDisplay(){
		document.querySelector('#groupButtonsContainer').innerHTML = '';

		let ob = await rhit.fbAuthManager.getuserObject();
		let groups = ob.groups;
		for(let i = 0; i < groups.length; i++){
			let name = '';
			let description = '';
			this._ref.where("name", "==", groups[i])
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					name = doc.data().name;
					description = doc.data().description;
					document.querySelector('#groupButtonsContainer').innerHTML += `<button class="groupButton">
					<strong>${name}</strong><hr>${description}</button>`;
				});
			})
		}
	}
}

rhit.LoginPageController = class {
	constructor() {

	}

}

rhit.HomePageController = class {
	constructor () {
		document.querySelector("#signOut").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};
	}
}

rhit.GroupsPageController = class {
	constructor () {
		document.querySelector("#signOut").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};
		rhit.fbGroupsManager.updategroupDisplay();
	}
}

rhit.JournalPageController = class {
	constructor () {
		document.querySelector("#signOut").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};
		document.querySelector("#saveButton").addEventListener("click", (event) => {
			console.log("journal save")
			const entryJou = document.querySelector("#journalText").value;
			let date = new Date().toUTCString().slice(5, 16);
			rhit.fbJournalEntriesManager.add(entryJou, 0, date);
			rhit.fbJournalEntriesManager.createCard(entryJou,date);
			console.log("after add");
			event.preventDefault();
		});
	}
}

rhit.SoundsPageController = class {
	constructor () {
		console.log("sounds");

		// document.addEventListener('DOMContentLoaded', function() {
		// 	console.log("sounds");
		// 	const soundButtons = document.querySelectorAll('.sound-button');
		// 	const soundPlayer = document.getElementById('sound-player');
		// 	let isPlaying = false;
			
			soundButtons.forEach(function(button) {
				button.addEventListener('click', function() {
				const sound = this.getAttribute('data-sound');
				if (isPlaying && !soundPlayer.paused && soundPlayer.getAttribute('data-sound') === sound) {
					pauseSound();
				} else {
					playSound(sound);
				}
				});
			});
			
			function playSound(sound) {
				soundPlayer.src = `sounds/${sound}.mp3`;
				soundPlayer.loop = true;
				soundPlayer.setAttribute('data-sound', sound);
				soundPlayer.play();
				isPlaying = true;
			}
			
			function pauseSound() {
				soundPlayer.pause();
				isPlaying = false;
			}
		// });

		}
}


rhit.initializePage = function() {
	console.log("initializing");
	if (document.querySelector("#loginPage")) {
		console.log("login");
		new rhit.LoginPageController();
	}

	if (document.querySelector("#homePage")) {
		console.log("home");
        const urlParams = new URLSearchParams(window.location.search);
        new rhit.HomePageController();
    }

	if (document.querySelector("#journalPage")) {
		console.log("journal");
		rhit.fbJournalEntriesManager = new rhit.JournalEntriesManager(firebase.auth().currentUser.uid);
		new rhit.JournalPageController();
		
	}

	if (document.querySelector("#groupsPage")) {
		console.log("groups");
		rhit.fbGroupsManager = new rhit.GroupsManager();
		new rhit.GroupsPageController();
	}

	if (document.querySelector("#soundsPage")) {
		console.log("sounds");
		new rhit.SoundsPageController();
		
	}

};

rhit.checkForRedirects = function(){
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/home.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	rhit.fbAuthManager = new rhit.AuthManager();
	rhit.fbAuthManager.beginListening(() => {
		rhit.checkForRedirects();
		rhit.initializePage();
	});
	if(document.querySelector("#firebaseui-auth-container"))
		rhit.startFirebaseUI();	
};

//FIREBASE LOGIN
rhit.startFirebaseUI = function() {
	var uiConfig = {
		signInSuccessUrl: '/home.html',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
	};

	if(firebaseui.auth.AuthUI.getInstance()) {
		const ui = firebaseui.auth.AuthUI.getInstance()
		ui.start('#firebaseui-auth-container', uiConfig)
	  } else {
		const ui = new firebaseui.auth.AuthUI(firebase.auth())
		ui.start('#firebaseui-auth-container', uiConfig)
	  }
	
}


rhit.main();
