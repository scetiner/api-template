
/**
 * AbstractChecker is a utility class that detects whether abstract methods are defined or not
 */
module.exports = class AbstractChecker {
    /**
     * Checks if abstract methods are implemented, otherwise, throws exception
     * AbstractChecker.check(this, new.target, ["create", "update"]);
     * @param {object} callee caller context such as "this"
     * @param {object} target target context such as "new.target"
     * @param {Array} methods String array contains method list
     * @throws {TypeError} missing implementation of a method
     */
    static check(callee,target, methods) {
        methods.forEach(m => {
            if (typeof callee[m] !== "function") {
                throw new TypeError(
                    `${target.name} must implement the following method: ${m}`
                );
            }
        });
    }
}