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

rhit.FB_COLLECTION_JOURNAL = "JournalEntry";
rhit.FB_KEY_DATE = "date";
rhit.FB_KEY_RATING = "Entry";
rhit.FB_KEY_AUTHOR = "author";
rhit.FB_KEY_ENTRY = "entry";
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

rhit.JournalManager = class {
	constructor(uid){
		this.__uid = uid;
		this._documentSnapshots = [];
		this.ref_ = firebase.firestore().collection(rhit.FB_COLLECTION_JOURNAL);
	}

	add(entry, rating, date){
		this.ref_.add({
			[rhit.FB_KEY_ENTRY]: entry,
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_DATE]: date,
			[rhit.FB_KEY_AUTHOR]: this.__uid,
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
			const entry = document.querySelector("#journalText").value;
			let date = new Date().toUTCString().slice(5, 16);
			rhit.JournalManager.add(entry, 0, date);
		});
	}
}

rhit.SoundsPageController = class {
	constructor () {
		
	}
}


rhit.initializePage = function() {
	console.log("initializing");
	if (document.querySelector("#loginPage")) {
		console.log("login");
		new rhit.LoginPageController();
		

		
	}


	if (document.querySelector("#loginPage")) {
		console.log("detail");
        const urlParams = new URLSearchParams(window.location.search);
        new rhit.HomePageController();
    }

	if (document.querySelector("#journalPage")) {
		console.log("journal");
		rhit.JournalManager = new rhit.JournalManager();
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
	});

	rhit.initializePage();

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	// document.querySelector("#signOutButton").onclick = (event) => {
	// 	firebase.auth().signOut().then(function () {
	// 		console.log("signed out");
	// 	}).catch(function(error){
	// 		console.log("sign out error");
	// 	});
	// };

	// document.querySelector("#createAccountButton").onclick = (event) => {
	// 	console.log(`Create account for email: ${inputEmailEl.value} password:  ${inputPasswordEl.value}`);
	// 	firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function (error) {
	// 		var errorCode = error.code;
	// 		var errorMessage = error.message;
	// 		console.log("Create account error", errorCode, errorMessage);
	// 	});
	// };
	// document.querySelector("#logInButton").onclick = (event) => {
	// 	console.log(`Log in for email: ${inputEmailEl.value} password:  ${inputPasswordEl.value}`);
	// 	firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function (error) {
	// 		var errorCode = error.code;
	// 		var errorMessage = error.message;
	// 		console.log("Existing account log in error", errorCode, errorMessage);
	// 	});
	// };

	// document.querySelector("#anonymousAuthButton").onclick = (event) => {
	// 	firebase.auth().signInAnonymously().catch(function (error) {
	// 		var errorCode = error.code;
	// 		var errorMessage = error.message;
	// 		console.log("Anonymous auth error", errorCode, errorMessage);
	// 	});
	// };

	// rhit.startFirebaseUI();
};

//FIREBASE LOGIN
rhit.startFirebaseUI = function() {
	var uiConfig = {
		signInSuccessUrl: '/',
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
	};

	
	const ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start("#firebaseui-auth-container", uiConfig);
}

// rhit.initializePage = function() {
// 	console.log("initializing");
// 	if (document.querySelector("#listPage")) {
// 		console.log("list");
// 		const urlParams = new URLSearchParams(window.location.search);
// 		const uid = urlParams.get("uid");
// 		rhit.fbPhotoManager = new rhit.FbPhotoManager(uid);
// 		new rhit.PageController();
		
		
// 	}


// 	if (document.querySelector("#detailPage")) {
// 		console.log("detail");
//         const urlParams = new URLSearchParams(window.location.search);
//         const photoID = urlParams.get("id");
//         if (!photoID) {
//             window.location.href = "/";
//         }
// 		console.log('before photo mag')
//         rhit.fbSinglePhotoManager = new rhit.FbSinglePhotoManager(photoID);
// 		console.log('before detail controller')
//         new rhit.DetailPageController();
//     }

// 	if (document.querySelector("#loginPage")) {
// 		console.log("login");
// 		new rhit.LoginPageController();
		
// 	}

// };

rhit.main();
