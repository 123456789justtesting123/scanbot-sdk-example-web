class CroppingViewController {

    constructor(results) {
        this.results = results;
        this.container = Utils.getElementByClassName("cropping-controller");
        this.parentControllerContainer = Utils.getElementByClassName("detection-result-controller");
        this.croppingView = undefined;

        Utils.getElementByClassName("detect-button").onclick = async (e) => {
            await this.croppingView.detect();
        };

        Utils.getElementByClassName("rotate-button").onclick = async (e) => {
            await this.croppingView.rotate(1);
        };

        Utils.getElementByClassName("apply-button").onclick = async (e) => {
            ViewUtils.showLoading();
            const result = await this.croppingView.apply();
            const index = Utils.getElementByClassName(
                "detection-result-image"
            ).getAttribute("index");
            this.results[index].filtered = undefined;
            this.results[index].cropped = result.image;
            this.results[index].polygon = result.polygon;
            this.results[index].rotations = result.rotations;

            if (this.results[index].filter) {
                this.results[index].filtered = await scanbotSDK.applyFilter(
                    this.results[index].cropped,
                    this.results[index].filter
                );
            }

            this.close();

            await updateResultImage(index);
            ViewUtils.hideLoading();
        };
    }

    async show(options) {
        this.parentControllerContainer.style.display = "none";
        this.container.style.display = "block";
        this.croppingView = await scanbotSDK.openCroppingView(options);
    }

    close() {
        this.container.style.display = "none";
        this.parentControllerContainer.style.display = "block";
        this.croppingView.dispose();
        this.croppingView = undefined;
    }
}