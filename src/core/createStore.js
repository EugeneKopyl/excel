export function createStore(rootReducer, initialState = {}) {
    let state = rootReducer({...initialState}, {type: '__INIT__'})
    let listeners = []

    return {
        subscribe: function(fn) {
            listeners.push(fn)
            return {
                unsubscribe() {
                    listeners = listeners.filter(l => l !== fn)
                }
            }
        },
        dispatch(action) {
            state = rootReducer(state, action)
            listeners.forEach(l => l(state))
        },
        getState() {
            return JSON.parse(JSON.stringify(state))
        }
    }
}
