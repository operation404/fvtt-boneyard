# Boneyard
Boneyard is a module for any general use tools I think I might need in my Foundry games.

## Socketlib wrapper functions for executing anonymous functions
It is possible to execute anonymous functions through socketlib using the wrapper functions Boneyard provides. Boneyard converts the function to a string and sends that string through socketlib to a registered handler which parses the string back into a function and executes it. 

```js
Boneyard.executeForEveryone_wrapper((args) => {
  console.log(`Greetings ${game.user.name}!`);
});

// Each user should see 'Greetings' followed by their name
```

The functions can have a single argument (called *args* in these examples) which should be an object that contains any actual arguments the function might need.

```js
let result = await Boneyard.executeAsGM_wrapper((args) => {
  console.log(args.a);
  console.log(args.b);
  let c = args.a+args.b;
  console.log(c);
  return c;
}, {a: 5, b: 3});

result += 1;
console.log(result);

// Should output 5, 3, 8, and 9
```

**Important warning:** Keep in mind that when the *args* object is serialized for sending through socketlib, it's effectively turned into a string and parsed back into an object by the other client. This means that *args* and all of the data it contains is a copy, and modifying them on the receiving client will not alter the original data on your end. The object will also lose any functions it contains. The process of serializing an object also serializes any nested objects it contains, which can create an infinite loop resulting in a call stack error if there are any circular reference chains. 

Foundry documents are self-referential by nature, but most (if not all) Foundry objects avoid infinite loops during serialization by overriding the serialization functions and only serializing a specific subset of their properties. Still, you should not pass Foundry documents as arguments through socketlib as the client will only receive a copy of that document's data, and you won't be able to modify whatever token/actor/etc the document actually represents in the game world. If you wish to modify a document inside of the function you are sending, you should store the document's id in *args* and use it to retrieve the document on the receiving client.

The function sent will also be executed in the global scope instead of the current scope at the time of calling the Boneyard wrapper. This means that while the function cannot access local variables in the scope it was declared in, it can still access global Foundry variables such as *game*, as seen in the first example.

```js
// This will cause errors when any client other than the sender executes the
// function because game.user.targets will be serialized before being sent over
// the socket and any document references won't persist
Boneyard.executeAsGM_wrapper((args)=>{
    args.targets.forEach(token => { // Throws an error
        token.actor.update({
            "data.hp.value": token.actor.data.data.hp.value - 1, // Reduce target hp by 1
        });
    });
}, args={targets: game.user.targets});

// This is a workaround for the above. Token ids are strings and can be safely sent
// over sockets, the receiving client can then find the desired tokens by their id
Boneyard.executeAsGM_wrapper((args)=>{
    args.target_ids.forEach(id => { 
        // Find each token the player originally had targeted
        let token = canvas.tokens.placeables.find(token => token.id === id);
        token.actor.update({
            "data.hp.value": token.actor.data.data.hp.value - 1, // Reduce target hp by 1
        });
    });
}, args={target_ids: game.user.targets.ids});
```

Boneyard provides a wrapper for each of the socketlib call functions.

```js
static executeAsGM_wrapper = async (func, args) => {...};
static executeAsUser_wrapper = async (userID, func, args) => {...};
static executeForAllGMs_wrapper = async (func, args) => {...};
static executeForOtherGMs_wrapper = async (func, args) => {...};
static executeForEveryone_wrapper = async (func, args) => {...};
static executeForOthers_wrapper = async (func, args) => {...};
static executeForUsers_wrapper = async (recipients, func, args) => {...};
```

If desired, you can also access Boneyard's socket directly as well as use the functions used for converting and recovering functions to and from strings. Since socketlib requires the function being called to be registered, this likely isn't very useful unless you use a world script or modify this module to register more functions, since the only registered function is Boneyard's *boneyard_exec* function and Boneyard already wraps each possible socketlib call with it.

```js
let result = await Boneyard.socket.executeAsGM("boneyard_exec", 
  Boneyard.prepare_func(() => {console.log("Hello!"); return 5;})
);
console.log(result);

// Should output 'Hello!' followed by '5'
```

## Requirements
The following modules are required for Boneyard to function properly:
* [socketlib](https://github.com/manuelVo/foundryvtt-socketlib)

