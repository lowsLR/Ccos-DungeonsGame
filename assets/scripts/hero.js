// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const {
	log
} = console;
const Input = {}; //记录按下状态 
cc.Class({
	extends: cc.Component,

	properties: {

	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		// 键盘输入
		cc.systemEvent.on('keydown', this.onKeyDown, this);
		cc.systemEvent.on('keyup', this.onKeyUp, this);
		//速度
		this._speed = 200;
		this.state = ''; //人物状态
		this.sp = cc.v2(0, 0); //记录当前坐标
		this.heroAri = this.node.getComponent(cc.Animation); //获取节点
		// log(this.heroAri, "===>获取？")
		// 加入触屏控制
		// let touchReceiver = cc.Canvas.instance.node;
		// touchReceiver.on('touchstart', this.onTouchStart, this);
		// touchReceiver.on('touchend', this.onTouchEnd, this); 
	},
	start() {

	},
	//键盘输入
	onKeyDown(e) {
		// log(e.keyCode, "===>键盘按下");
		Input[e.keyCode] = 1;
	},
	onKeyUp(e) {
		Input[e.keyCode] = 0;
	},
	// 触屏控制
	onTouchStart(e) {
		// log(e.getLocation().x, "==?触屏控制");
		let start = e.getLocation();
		// log(this.node.x, "==>this.node.x")
		// log(this.node.y, "==>this.node.y")
		// log(start.x, "==>start.x")
		// log(start.y, "==>start.y")
		log(start, "===>start")
		// Input[e.keyCode] = 1; 
	},
	onTouchEnd(e) {
		// Input[e.keyCode] = 0;
		let end = e.getPreviousLocation();
		log(end, "==>end")
		log(e.getDelta(), "===>getDelta")
	},
	update(dt) {
		if (window.dialog && window.dialog.active) return;
		if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
			this.sp.x = -1;
		} else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
			this.sp.x = 1;
		} else {
			this.sp.x = 0;
		}
		if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
			this.sp.y = 1;
		} else if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
			this.sp.y = -1;
		} else {
			this.sp.y = 0;
		}
		// 获取移动速度 
		this.lv = this.node.getComponent(cc.RigidBody).linearVelocity;
		// log(this.lv, "===>this.lv")
		if (this.sp.x) {
			// this.node.x += this.sp.x * this._speed * dt
			this.lv.y = 0;
			this.lv.x += this.sp.x * this._speed * dt;
		} else if (this.sp.y) {
			// this.node.y += this.sp.y * this._speed * dt
			this.lv.x = 0;
			this.lv.y += this.sp.y * this._speed * dt;
		} else {
			this.lv.y = this.lv.x = 0;
		}
		// 设置移动速度 
		this.node.getComponent(cc.RigidBody).linearVelocity = this.lv;
		let state = '';
		if (this.sp.x == 1) {
			state = "hero_right";
		} else if (this.sp.x == -1) {
			state = "hero_left";
		} else if (this.sp.y == 1) {
			state = "hero_up";
		} else if (this.sp.y == -1) {
			state = "hero_down";
		}
		if (state) {
			this.setState(state);
		}

	},
	// 人物状态 
	setState(state) {
		// this.state = this.state == state ? this.state : state;
		if (this.state == state) return;
		this.state = state;
		this.heroAri.play(this.state);
	},
	// 销毁玩家输入事件 
	onDestroy() {
		cc.systemEvent.on('keydown', this.onKeyDown, this);
		cc.systemEvent.on('keyup', this.onKeyUp, this);
		let touchReceiver = cc.Canvas.instance.node;
		touchReceiver.off('touchstart', this.onTouchStart, this);
		touchReceiver.off('touchend', this.onTouchEnd, this);
	},
	// 碰撞回调
	onCollisionEnter(other, self) {
		if (other.node.group == 'smog') {
			other.node.active = false;
			other.node.getComponent(cc.TiledTile).gid = 0;
		}
	}
});
