

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
rhit.LoginManager = null;
rhit.HomeManager = null;
rhit.GroupsManager = null;
rhit.JournalManager = null;
rhit.SoundsManager = null;

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
		this.__ref = firebase.firestore().collection('users').doc(uid).collection('journalEntries');
	}

	add(entry, rating, date){
		console.log({
			[rhit.FB_KEY_ENTRY]: entry,
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_DATE]: date,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now()

		});
		rhit.badVariable = this.__ref.add({
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

		console.log("initiated adding");
		console.log("my uid=", this.__uid);
		console.log(rhit.badVariable);
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
}

rhit.GroupsManager = class {
	constructor(uid){
		this._uid = uid;
		this._documentSnapshots = [];
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
	getMovieQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_ENTRY),
			docSnapshot.get(rhit.FB_KEY_DATE),
			docSnapshot.get(rhit.FB_KEY_RATING)
		);
		return mq;
	}
}

rhit.LoginPageController = class {
	constructor() {

	}

}

rhit.HomePageController = class {
	constructor () {

	}
}

rhit.GroupsPageController = class {
	constructor () {
		
	}
}

rhit.JournalPageController = class {
	constructor () {
		document.querySelector("#saveButton").addEventListener("click", (event) => {
			console.log("journal save")
			const entryJou = document.querySelector("#journalText").value;
			let date = new Date().toUTCString().slice(5, 16);
			rhit.JournalEntriesManager.add(entryJou, 0, date);
			console.log("after add");
			event.preventDefault();
		});
	}
}

rhit.SoundsPageController = class {
	constructor () {

		document.addEventListener('DOMContentLoaded', function() {
			const soundButtons = document.querySelectorAll('.sound-button');
			const soundPlayer = document.getElementById('sound-player');
			let isPlaying = false;
			
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
		});

		}
}


rhit.initializePage = function() {
	console.log("initializing");
	// if (document.querySelector("#loginPage")) {
	// 	console.log("login");
	// 	new rhit.LoginPageController();
		

		
	// }


	if (document.querySelector("#loginPage")) {
		console.log("detail");
        const urlParams = new URLSearchParams(window.location.search);
        new rhit.HomePageController();
    }

	if (document.querySelector("#journalPage")) {
		console.log("journal");
		rhit.JournalEntriesManager = new rhit.JournalEntriesManager(firebase.auth().currentUser.uid);
		new rhit.JournalPageController();
		
	}

	if (document.querySelector("#groupsPage")) {
		console.log("groups");
		new rhit.GroupsPageController();
		
	}

	if (document.querySelector("#soundsPage")) {
		console.log("sounds");
		new rhit.SoundsPageController();
		
	}

};
	


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	firebase.auth().onAuthStateChanged(function(user) {
		if(user) {
			var displayName = user.displayName;
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			console.log("signed in");
		} else {
			console.log("no sign in");
		}
		rhit.initializePage();
	});

	

	if(document.querySelector("#firebaseui-auth-container")){
		rhit.startFirebaseUI();
	}
	
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
