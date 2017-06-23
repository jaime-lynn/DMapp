import axios from 'axios'
import router from '../router'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let dnd = axios.create({
  baseURL: 'http://www.dnd5eapi.co/api',
  timeout: 2000
})

let dndblank = axios.create({
  baseURL: '',
  timeout: 2000
})

let api = axios.create({
  baseURL: '//localhost:3000/api/',
  timeout: 2000,
  withCredentials: true
})

let auth = axios.create({
  baseURL: '//localhost:3000/',
  timeout: 2000,
  withCredentials: true
})

// REGISTER ALL DATA HERE
let state = {
 characters: [],
  campaigns: [],
  activeCampaign: {},
  encounters: [],
  activeEncounter: {},
  players: [],
  monsters: [],
  activeMonster: {},
  spells: [],
  activeSpell: {},
  weapons: [],
  equipment: [],
  activeEquipment: {},
  conditions: [],
  error: {},
  user: {}
}

let handleError = (state, err) => {
  state.error = err
}

export default new Vuex.Store({
  // ALL DATA LIVES IN THE STATE
  state,

  mutations: {
    setCharacters(state, characters) {
      state.characters = characters
    },
    setCampaigns(state, campaigns) {
      state.campaigns = campaigns
    },
    setActiveCampaign(state, activeCampaign) {
      Vue.set(state, 'activeCampaign', activeCampaign)
    },
    setEncounters(state, encounters) {
      state.encounters = encounters
    },
    setActiveEncounter(state, activeEncounter) {
      state.activeEncounter = activeEncounter
    },
    setPlayers(state, players) {
      state.players = players
    },

    setConditions(state, conditions) {
      state.conditions = conditions
    },

    setUser(state, user) {
      state.user = user
    },

    //DND5E setters

    setMonsters(state, monsters) {
      state.monsters = monsters.results
      console.log('monsters:' + monsters.count)
    },

    setSpells(state, spells) {
      state.spells = spells.results
      console.log('spells:' + spells.count)
    },

    setEquipment(state, equipment) {
      state.equipment = equipment.results
      console.log('equipment:' + equipment.count)
    },

    setActiveEquipment(state, activeEquipment) {
      state.activeEquipment = activeEquipment
    },

    setActiveMonster(state, activeMonster) {
      state.activeMonster = activeMonster
      console.log(activeMonster)
  },
    setActiveSpell(state, activeSpell) {
      state.activeSpell = activeSpell
    },
    setInit(state, sortFunction){
       for(var i = 0; i < state.characters.length; i++){
        
        state.characters[i].initiative = Math.floor(Math.random()*20 + 1 + dexterityMod)
      }
      state.characters.sort((a,b)=>{
        if (a.initiative < b.initiative){
          return 1;
        }
        if (b.initiative < a.initiative){
          return -1;
      }
      return 0;
      })
    },
    // I think we should be able to figure out how to add something that would work universally for str, dex, con, etc. that's why i just put blarg in. I just don't know what it should be.
    setMod(state, ){
      var mod = 0
      if(blarg == 1){
        mod = -5
      }
      else if(blarg == 2 || blarg == 3){
        mod = -4
      }
      else if(blarg == 4 || blarg == 5){
        mod = -3
      }
      else if(blarg == 6 || blarg == 7){
        mod = -2
      }
      else if(blarg == 8 || blarg == 9){
        mod = -1
      }
      else if(blarg == 10 || blarg == 11){
        mod = 0
      }
      else if(blarg == 12 || blarg == 13){
        mod = +1
      }
      else if(blarg == 14 || blarg == 15){
        mod = +2
      }
      else if(blarg == 16 || blarg == 17){
        mod = +3
      }
      else if(blarg == 18 || blarg == 19){
        mod = +4
      }
      else if(blarg == 20 || blarg == 21){
        mod = +5
      }
      else if(blarg == 22 || blarg == 23){
        mod = +6
      }
      else if(blarg == 24 || blarg == 25){
        mod = +7
      }
      else if(blarg == 26 || blarg == 27){
        mod = +8
      }
      else if(blarg == 28 || blarg == 29){
        mod = +9
      }
      else if(blarg == 30 || blarg == 31){
        mod = +10
      }
      return mod
    },
    setHealth(state, data){
      var charIndex = state.characters.indexOf(data.character)
      state.characters[charIndex].health+=data.value
    }

  },

  // ACTIONS ARE RESPONSIBLE FOR MANAGING ALL ASYNC REQUESTS
  actions: {

    getCampaigns({ commit, dispatch }) {
      api('/usercampaigns')
        .then(res => {
          commit('setCampaigns', res.data.data)
        })
        .catch(handleError)
    },
    getCampaign({ commit, dispatch }, id) {
      api('/campaigns/' + id)
        .then(res => {
          commit('setActiveCampaign', res.data.data)
        })
        .catch(handleError)
    },
    createCampaign({ commit, dispatch }, campaign) {
      api.post('/campaigns/', campaign)
        .then(res => {
          dispatch('getCampaigns')
        })
        .catch(handleError)
    },
    removeCampaign({ commit, dispatch }, campaign) {
      api.delete('/campaigns/' + campaign._id)
        .then(res => {
          dispatch('getCampaigns')
        })
        .catch(handleError)
    },
    getEncounters({ commit, dispatch }, id) {
      api('/campaigns/' + id + '/encounters/')
        .then(res => {
          commit('setEncounters', res.data.data)
        })
        .catch(handleError)
    },
    getEncounter({ commit, dispatch }, id) {
      api('/encounters/' + id)
        .then(res => {
          commit('setActiveEncounter', res.data.data)
        })
        .catch(handleError)
    },
    createEncounter({ commit, dispatch }, encounter) {
      api.post('/encounters', encounter)
        .then(res => {
          dispatch('getEncounters', encounter.campaignId)
        })
        .catch(handleError)
    },
    removeEncounter({ commit, dispatch }, encounter) {
      api.delete('/encounters/' + encounter._id)
        .then(res => {
          dispatch('getEncounters', encounter.campaignId)
        })
        .catch(handleError)
    },
    getPlayers({ commit, dispatch }, id) {
      api('/campaigns/' + id + '/players')
        .then(res => {
          commit('setPlayers', res.data.data)
        })
        .catch(handleError)
    },
    createPlayer({ commit, dispatch }, player) {
      api.post('/players', player)
        .then(res => {
          dispatch('getPlayers', player.campaignId)
        })
        .catch(handleError)
    },
    removePlayer({ commit, dispatch }, player) {
      api.delete('/players/' + player._id)
        .then(res => {
          dispatch('getPlayers', player.campaignId)
        })
        .catch(handleError)
    },
    getCharacters({ commit, dispatch }, id) {
      api('/encounters/' + id + '/characters')
        .then(res => {
          commit('setCharacters', res.data.data)
        })
        .catch(handleError)
    },
    createCharacter({ commit, dispatch }, id) {
      api.post('/characters', character)
        .then(res => {
          dispatch('getCharacters', character.encounterId)
        })
        .catch(handleError)
    },    
    removeCharacter({ commit, dispatch }, character) {
      api.delete('/characters/' + character._id)
        .then(res => {
          dispatch('getCharacters', character.encounterId)
        })
        .catch(handleError)
    },
    movePlayers({commit, dispatch}, player){
      api.post('./characters/' + player.encounterId, player)
        .then(res => {
          console.log(res.data.data)
          commit('setCharacters', res.data.data)
        })
          dispatch('getCharacters', player.encounterId)
    },
    login({ commit, dispatch }, user) {
      auth.post('login', user)
        .then(res => {
          if (res.data.error) {
            return handleError(res.data.error)
          }
          commit('setUser', res.data.data)
          router.push('/campaigns')
        })
        .catch(handleError)
    },
    register({ commit, dispatch }, user) {
      auth.post('register', user)
        .then(res => {
          if (res.data.error) {
            return handleError(res.data.error)
          }
          commit("setUser", res.data.data)
          router.push('/campaigns')
        })
        .catch(handleError)
    },
    getAuth() {
      auth('authenticate')
        .then(res => {
          if (!res.data.data) {
            return router.push('/login')
          }
          state.user = res.data.data
          router.push('/campaigns')
        }).catch(err => {
          router.push('/login')
        })
    },
    logout({ commit, dispatch }, user) {
      auth.delete('logout', user)
        .then(res => {
          router.push('/')
        }).catch(handleError)
    },
    clearError() {
      state.error = {}
    },
    //API Calls for DND5E
    getMonsters({ commit, dispatch }) {
      dnd('/monsters')
        .then(res => {
          commit('setMonsters', res.data)
        })
        .catch(handleError)
    },
    getSpells({ commit, dispatch }) {
      dnd('/spells')
        .then(res => {
          commit('setSpells', res.data)
        })
        .catch(handleError)
    },
    getEquipment({ commit, dispatch }) {
      dnd('/equipment')
        .then(res => {
          commit('setEquipment', res.data)
        })
        .catch(handleError)
    },
    getItem({ commit, dispatch }, url) {
      dndblank(url)
        .then(res => {
          commit('setActiveEquipment', res.data)
        })
        .catch(handleError)
    },
    getMonster({ commit, dispatch }, url) {
      dndblank(url)
        .then(res => {
          commit('setActiveMonster', res.data)
        })
        .catch(handleError)
    },
    moveMonster({ commit, dispatch}, encounterId){
      var monster = state.activeMonster
      monster.description = monster.size
      monster.health = monster.hit_points
      monster.maxHealth = monster.hit_points
      monster.encounterId = encounterId
      monster._id = null
      api.post('./characters/' + encounterId, monster)
        .then(res => {
          //console.log(res.data.data)
          dispatch('getCharacters', encounterId)
        })
    },
    getSpell({ commit, dispatch }, url) {
      dndblank(url)
        .then(res => {
          commit('setActiveSpell', res.data)
        })
        .catch(handleError)
    },
    setInit({ commit, dispatch }, customSort){
      commit('setInit', customSort )
    },
    updateHealth({ commit, dispatch}, data){
      commit('setHealth', data)
      //dispatch('saveEncounter')
    }
  }
})
