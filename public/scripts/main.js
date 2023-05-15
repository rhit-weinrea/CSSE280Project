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
rhit.fbAuthManager = null;

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
		this.__ref.add({
			[rhit.FB_KEY_ENTRY]: entry,
			[rhit.FB_KEY_RATING]: rating,
			[rhit.FB_KEY_DATE]: date,
			[rhit.FB_KEY_AUTHOR]:rhit.fbAuthManager.uid,
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

rhit.FbAuthManager = class {
	constructor() {
	  this._user = null;
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			let uid;

			if(user){
				uid = user.uid;
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
}

rhit.LoginPageController = class {
	constructor() {
		const inputEmailEl = document.querySelector("#inputEmail");
		const inputPasswordEl = document.querySelector("#inputPassword");
	
		document.querySelector("#signOutButton").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};
	
		document.querySelector("#createAccountButton").onclick = (event) => {
			console.log(`Create account for email: ${inputEmailEl.value} password:  ${inputPasswordEl.value}`);
			firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Create account error", errorCode, errorMessage);
			});
		};
		document.querySelector("#logInButton").onclick = (event) => {
			console.log(`Log in for email: ${inputEmailEl.value} password:  ${inputPasswordEl.value}`);
			firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Existing account log in error", errorCode, errorMessage);
			});
		};
	
		document.querySelector("#anonymousAuthButton").onclick = (event) => {
			firebase.auth().signInAnonymously().catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Anonymous auth error", errorCode, errorMessage);
			});
		};
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
	}
}

rhit.JournalPageController = class {
	constructor () {
		document.querySelector("#signOut").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};
	}
}

rhit.SoundsPageController = class {
	constructor () {
		document.querySelector("#signOut").onclick = (event) => {
			rhit.fbAuthManager.signOut();
		};
	}
}

rhit.checkForRedirects = function(){
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/home.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
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
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		rhit.checkForRedirects();
		rhit.initializePage();
	});
	rhit.startFirebaseUI();
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
