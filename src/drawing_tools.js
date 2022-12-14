export {
    Drawing_Tools
};

class Drawing_Tools extends Application {

    static init() {
        Drawing_Tools.prepare_hook_handlers();
        console.log(`====== Boneyard ======\n - Drawing tools initialized`);
    }

    static prepare_hook_handlers() {
        Hooks.on("getSceneControlButtons", (controls) => Drawing_Tools.add_control_buttons(controls));
    }

    static add_control_buttons(controls) {
        const drawing_controls = controls.find(control_set => control_set.name === "drawings");

        drawing_controls.tools.push({
            "name": "set-stroke-color",
            "icon": "fas fa-paint-brush",
            "title": "CONTROLS.DrawingStrokeColor",
            "onClick": () => {
                new Drawing_Tools({
                    color_type: 'strokeColor'
                }).render(true);
            },
            button: true,
        });

        drawing_controls.tools.push({
            "name": "set-fill-color",
            "icon": "fas fa-fill-drip",
            "title": "CONTROLS.DrawingFillColor",
            "onClick": () => {
                new Drawing_Tools({
                    color_type: 'fillColor'
                }).render(true);
            },
            button: true,
        });
    }


    /**
     * @typedef {object} Drawing_Tools_Options extends ApplicationOptions
     * @property {string|null} [color_type]  Either 'strokeColor' or 'fillColor'
     */

    /**
     * The Drawing_Tools Application window.
     * @param {Drawing_Tools_Options} [options]  Configuration options.
     *                                           'color_type' option determines what drawing tool color is being set.
     *                                            Also includes all normal Application options.
     */

    constructor(options = {}) {
        super(options);
        console.log(options.color_type);
        this.color_type = options.color_type ? options.color_type : null;

    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `modules/boneyard/templates/color_selector.html`,
            id: 'drawing_tools',
            popOut: true,
        });
    }

    getData() {
        // Send data to the html template
        return {
            msg: this.color_type,
            color: 'red',
        };
    }


    // Don't need this yet
    /*
	getData() {
        // Send data to the template
        return {
            msg: this.color_type,
            color: 'red',
        };
    }
	*/

    activateListeners(html) {
        super.activateListeners(html);
    }

    /**
     * Customize how a new HTML Application is added and first appears in the DOM
     * @param {jQuery} html       The HTML element which is ready to be added to the DOM
     * @private
     */
    _injectHTML(html) {
        $('body').append(html);
        this._element = html;
        //html.show(); // Doesn't do anything
        html.hide().fadeIn(1200); // html starts hidden and fades in
    }


    // color_type: either 'stroke' or 'fill'
    static async render_color_selector(color_type) {
        const drawing_defaults = game.settings.get("core", DrawingsLayer.DEFAULT_CONFIG_SETTING);
        if (drawing_defaults === undefined) return;
        console.log(drawing_defaults);
        console.log(this);
        console.log(document);
        console.log(window);

        const template_data = {
            color_key: `${color_type}Color`,
            color: drawing_defaults[`${color_type}Color`]
        };

        /*
        const template = `modules/boneyard/templates/color_selector.html`;
        const html = await renderTemplate(template, template_data);

        const node = document.createElement("div");
        node.setAttribute("id", "color_selector");
        node.setAttribute("class", "color_selector");
        node.innerHTML = html;

        document.body.appendChild(node);
        */
    }

}