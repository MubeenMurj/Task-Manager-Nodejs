const mongoose = require("mongoose")
const validator = require("validator")

const Tasks = mongoose.model("Tasks", {
	description: {
		type: String,
		require: true,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		require: true,
	},
})

module.exports = Tasks
