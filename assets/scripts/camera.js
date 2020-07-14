// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		playerNode: cc.Node
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}, 

	start() {

	},

	update(dt) {
		if (!this.playerNode) return;
		// 获取世界坐标(人物当前所有的坐标)
		let w_pos = this.playerNode.convertToWorldSpaceAR(cc.v2(0, 0));
		// 转换坐标点到节点下（摄像机Main Camera）
		let n_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
		this.node.position = n_pos;
	},
});
