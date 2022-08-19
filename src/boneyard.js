class Boneyard {
	static module_id = "boneyard";
	static socket;
	
	static init = () => {
		console.log("====== Boneyard ======\n - module init");
		Hooks.once("socketlib.ready", () => {
			let boneyard_socket = socketlib.registerModule(Boneyard.module_id);
			boneyard_socket.register("boneyard_exec", this.boneyard_exec)
			window.Boneyard = Boneyard; // set up our global, all globals are members of window
			Boneyard.socket = boneyard_socket;
			console.log("====== Boneyard ======\n - socket set");
		});
	};
	
	// Functions must be of the form (args)=>{} 
	// where 'args' is an object containing all arguments for the function.
	static boneyard_exec = async (func_str, args) => {
		let func = this.recover_func(func_str);
		console.log("====== Boneyard ======\n - executing function: ", func);		
		let return_value = await func(args);
		return return_value;
	};
	
	static prepare_func = (func) => {
		return `return (${func.toString()})(args);`;
	};
	static recover_func = (func_str) => {
		return new Function("args", func_str);
	};
	
	static executeAsGM_wrapper = async (func, args) => {
		return this.socket.executeAsGM("boneyard_exec", this.prepare_func(func), args);
	};
	static executeAsUser_wrapper = async (userID, func, args) => {
		return this.socket.executeAsUser("boneyard_exec", userID, this.prepare_func(func), args);
	};
	static executeForAllGMs_wrapper = async (func, args) => {
		return this.socket.executeForAllGMs("boneyard_exec", this.prepare_func(func), args);
	};
	static executeForOtherGMs_wrapper = async (func, args) => {
		return this.socket.executeForOtherGMs("boneyard_exec", this.prepare_func(func), args);
	};
	static executeForEveryone_wrapper = async (func, args) => {
		return this.socket.executeForEveryone("boneyard_exec", this.prepare_func(func), args);
	};
	static executeForOthers_wrapper = async (func, args) => {
		return this.socket.executeForOthers("boneyard_exec", this.prepare_func(func), args);
	};
	static executeForUsers_wrapper = async (recipients, func, args) => {
		return this.socket.executeForUsers("boneyard_exec", recipients, this.prepare_func(func), args);
	};
}

Boneyard.init();
