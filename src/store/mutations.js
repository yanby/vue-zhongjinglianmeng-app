
import getters from './getters.js';

var state = {
	token: ""
}
const mutations = {
	login(state,data){
		localStorage.token = data;
		state.token = data;
	},
  logout(state,data){
    localStorage.clear();
    state.token = "";
  }
}


export default{
	state,
	mutations,
	getters
}
