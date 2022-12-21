import { Drawing_Tools } from "./drawing_tools.js";
import { Template_Tools } from "./template_tools.js";

class Boneyard {
    static module_id = "boneyard";
    static socket;
    static debug = false;

    static init() {
        Boneyard.log("Module init start");
        Boneyard.prepare_hook_handlers();

        // Create a global object to expose only the desired functions
        window.Boneyard = {
            module_id: Boneyard.module_id,
            debug: Boneyard.debug,
			Socketlib_Tools: {
				prepare_func: Boneyard.prepare_func,
				recover_func: Boneyard.recover_func,
				boneyard_exec: Boneyard.boneyard_exec,
				executeAsGM_wrapper: Boneyard.executeAsGM_wrapper,
				executeAsUser_wrapper: Boneyard.executeAsUser_wrapper,
				executeForAllGMs_wrapper: Boneyard.executeForAllGMs_wrapper,
				executeForOtherGMs_wrapper: Boneyard.executeForOtherGMs_wrapper,
				executeForEveryone_wrapper: Boneyard.executeForEveryone_wrapper,
				executeForOthers_wrapper: Boneyard.executeForOthers_wrapper,
				executeForUsers_wrapper: Boneyard.executeForUsers_wrapper
			},
        };
		
		Drawing_Tools.init();
		Template_Tools.init();
		
		Boneyard.log("Module initialized");
    }

    static log(log_str, additional_log_data) {
        if (log_str === undefined) return;
        console.log(`====== Boneyard ======\n - ${log_str}`);
        if (additional_log_data === undefined) return;
        console.log(additional_log_data);
    }

    static prepare_hook_handlers() {
        Hooks.once("socketlib.ready", Boneyard.register_socket);
    }

    static register_socket() {
        Boneyard.socket = socketlib.registerModule(Boneyard.module_id);
        Boneyard.socket.register("boneyard_exec", Boneyard.boneyard_exec)
		if (window?.Boneyard?.Socketlib_Tools !== undefined) window.Boneyard.Socketlib_Tools.socket = Boneyard.socket;
        Boneyard.log("socket set");
    }

    static prepare_func(func) {
        return `return (${func.toString()})(args);`;
    }
    static recover_func(func_str) {
        return new Function("args", func_str);
    }

    // Functions must be of the form (args)=>{} 
    // where 'args' is an object containing all arguments for the function.
    static async boneyard_exec(func_str, args) {
        const func = Boneyard.recover_func(func_str);
        if (Boneyard.debug) Boneyard.log("executing function", {
            func
        });
        return (await func(args));
    }

    static async executeAsGM_wrapper(func, args) {
        return Boneyard.socket.executeAsGM("boneyard_exec", Boneyard.prepare_func(func), args);
    }
    static async executeAsUser_wrapper(userID, func, args) {
        return Boneyard.socket.executeAsUser("boneyard_exec", userID, Boneyard.prepare_func(func), args);
    }
    static async executeForAllGMs_wrapper(func, args) {
        return Boneyard.socket.executeForAllGMs("boneyard_exec", Boneyard.prepare_func(func), args);
    }
    static async executeForOtherGMs_wrapper(func, args) {
        return Boneyard.socket.executeForOtherGMs("boneyard_exec", Boneyard.prepare_func(func), args);
    }
    static async executeForEveryone_wrapper(func, args) {
        return Boneyard.socket.executeForEveryone("boneyard_exec", Boneyard.prepare_func(func), args);
    }
    static async executeForOthers_wrapper(func, args) {
        return Boneyard.socket.executeForOthers("boneyard_exec", Boneyard.prepare_func(func), args);
    }
    static async executeForUsers_wrapper(recipients, func, args) {
        return Boneyard.socket.executeForUsers("boneyard_exec", recipients, Boneyard.prepare_func(func), args);
    }

}

Boneyard.init();