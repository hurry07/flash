Hi,

I am an developer of android/html/java, and I am working on flash exporting recently, here is part of my job.
It is a demo for transform a flash animation to an html5 page. It works fine on my Mac pro + flash cs6

It is a prototype project, only support flash animation, and here is an implement of cocos2dx(for game developing)
and an html5 port for web developing.
My next planning lies on your feed back, but I already have some plan:
1 supported shapes,
2 supported text
3 supported button and other customer UI component.

Following these steps:
1 Add the 'actionExport.zxp' plugin to your flash cs5(at least)
2 open a flash animation, and choose Command->Export Current
3 select a output folder, for example DEST_FOLDER.
4 create an html page at DEST_FOLDER, and you can take flash_js/index.html for an example.
5 open the html page in your browser.

your may use parameters behind to ensure the chrome to load xml from a local folder:
open Google\ Chrome.app --args --allow-file-access-from-files

some code documents
for html5:
    var loader = new FlashLoader();// create a xml parser
    var flash = loader.load(text);// parse an xml config file into a flash config object
    // create an flash instance,
    // you can use your Adapter to do some image name mapping
    // you can creates several instance from one 'flash' object;
    var ins = flash.createInstance(new CreateAdapter());
    var root = document.getElementById('root');// append the flash root element into your html5 page
    root.appendChild(ins.getNode());

    setInterval(function () {// start your schedule update
        ins.update(0.05);// time in seconds, 0.05 means 50ms
    }, 50);

for cocos2dx:
    FlashManager* manager = new FlashManager();
    manager->load("dragon", "dragon/boss_near_att.xml");
	FlashInstance* instance = manager->create("dragon");
	addChild(instance->getNode());
	instance->update(0);

