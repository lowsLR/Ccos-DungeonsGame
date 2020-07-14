// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let roleMap = {
	1: {
		name: '勇者',
		url: 'role/hero'
	},
	2: {
		name: '轱辘王',
		url: 'role/npc'
	}
}
cc.Class({
	extends: cc.Component,

	properties: {
		picSprite: cc.Sprite,
		nameLabel: cc.Label,
		textLabel: cc.Label,
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		cc.systemEvent.on('keydown', this.onKeyDown, this);
		window.dialog = this.node;
	},
	init(arr) {
		this.textIndex = -1;
		this.textArr = arr;
		this.node.active = true; //是否开启对话框 
		this.nextTextData();
		this.nowText = null;
		this.textEnd = true;
		this.tt = 0;
	},
	nextTextData() {
		if (!this.textEnd) return;
		if (++this.textIndex < this.textArr.length) {
			this.setTextdata(this.textArr[this.textIndex])
		} else {
			this.closeDislog()
		}
	},
	setTextdata(textData) {
		if (!this.textEnd) return;
		this.textEnd = true;
		this.nameLabel.string = roleMap[textData.role].name;
		// this.textLabel.string = textData.content;
		this.textLabel.string = '';
		this.nowText = textData.content;

		//动态加载资源
		cc.loader.loadRes(roleMap[textData.role].url, cc.SpriteFrame, (err, asset) => {
			this.picSprite.spriteFrame = asset;
		})
	},
	closeDislog() {
		this.node.active = false;
	},
	start() {

	},
	onKeyDown(e) {
		switch (e.keyCode) {
			case cc.macro.KEY.space:
				this.nextTextData();
				break;
		}
	},
	ondestroy(e) {
		cc.systemEvent.off('keydown', this.onKeyDown, this);
	},
	update(dt) {
		if (!this.nowText) return;
		this.tt += dt;
		if (this.tt >= 0.1) {
			if (this.textLabel.string.length < this.nowText.length) {
				this.textLabel.string = this.nowText.slice(0, this.textLabel.string.length + 1);
			} else {
				this.nowText = null;
				this.textEnd = true;
			}
			this.tt = 0;
		}
	},
})
