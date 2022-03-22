module.exports = async function wait(time) {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}