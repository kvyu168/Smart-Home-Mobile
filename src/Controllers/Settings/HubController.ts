﻿module JustinCredible.SmartHomeMobile.Controllers {

    export class HubController extends BaseController<ViewModels.HubViewModel> {

        public static ID = "HubController";

        public static get $inject(): string[] {
            return ["$scope", "$location", "$ionicHistory", Services.Utilities.ID, Services.Preferences.ID, Services.UiHelper.ID];
        }

        private $location: ng.ILocationService;
        private $ionicHistory: any;
        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;
        private UiHelper: Services.UiHelper;

        constructor($scope: ng.IScope, $location: ng.ILocationService, $ionicHistory: any, Utilities: Services.Utilities, Preferences: Services.Preferences, UiHelper: Services.UiHelper) {
            super($scope, ViewModels.HubViewModel);

            this.$location = $location;
            this.$ionicHistory = $ionicHistory;
            this.Utilities = Utilities;
            this.Preferences = Preferences;
            this.UiHelper = UiHelper;
        }

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.showSaveButton = false;
            this.viewModel.apiUrl = this.Preferences.alertMeApiUrl;
            this.viewModel.userName = this.Preferences.alertMeApiUserName;
            this.viewModel.password = this.Preferences.alertMeApiPassword;
        }

        //#endregion

        //#region Controller Methods

        protected apiInfo_click(): void {
            var infoMessage1 = "The hub is responsible for controlling communicating with the smart home devices, such as security, locks, power, thermostat, etc.";
            var infoMessage2 = "Currently supported hubs are ones that use the AlertMe API (such as Lowe's Iris Smart Home platform). This should be a URL to the root of the AlertMe API such as: https://api.alertme.com/v5";
            var promptMessage = "Would you like to use the default URL for Lowe's Iris Smart Home platform? (https://www.irissmarthome.com/v5)";

            this.UiHelper.alert(infoMessage1, "Hub Info").then(() => {
                this.UiHelper.alert(infoMessage2, "Hub Info").then(() => {
                    this.UiHelper.confirm(promptMessage, "Use Default").then((result: string) => {
                        if (result === "Yes") {
                            this.viewModel.apiUrl = "https://www.irissmarthome.com/v5";
                            this.viewModel.showSaveButton = true;
                        }
                    });
                });
            });
        }

        protected save_click(): void {

            if (!this.viewModel.apiUrl || !this.viewModel.userName || !this.viewModel.password) {
                this.UiHelper.alert("Please ensure all fields are populated.");
                return;
            }

            // If the password has changed, ensure that the new passwords match.
            if (this.viewModel.showConfirmPassword) {
                if (this.viewModel.password !== this.viewModel.confirmPassword) {
                    this.UiHelper.alert("The passwords do not match, please try again.");
                    this.viewModel.password = "";
                    this.viewModel.confirmPassword = "";
                    return;
                }
            }

            // Update the values in the preferences.
            this.Preferences.alertMeApiUrl = this.viewModel.apiUrl;
            this.Preferences.alertMeApiUserName = this.viewModel.userName;
            this.Preferences.alertMeApiPassword = this.viewModel.password;

            // Kick the user back to the settings list view.
            this.UiHelper.toast.showShortBottom("Changes have been saved.");
            this.$ionicHistory.goBack();
        }

        //#endregion
    }
}
