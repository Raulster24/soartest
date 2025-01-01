# e2e-mobile-wikipedia-automation

This project is an end-to-end (E2E) automation framework for testing the mobile version of Wikipedia using Java, Maven, Appium, TestNG, and an APK file. It uses automated scripts to verify the functionality and performance of the Wikipedia mobile app.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/e2e-mobile-wikipedia-automation.git
    ```
2. Navigate to the project directory:
    ```sh
    cd e2e-mobile-wikipedia-automation
    ```
3. Install the dependencies:
    ```sh
    mvn install
    ```
4. Place the APK file in a directory of your choice and update the configuration to point to the correct path. I have used the resources directry.
5. Ensure TestNG is installed in your IDE or included in your Maven dependencies.

## Usage

To run the automated tests, use the following command:
```sh
mvn test
```

## Project Structure

- `src/main/java/` - Contains the source code for the automation scripts.
- `src/test/java/` - Contains the test cases.
- `src/main/resources/` - Configuration files for the test environment and the APK file.
- `target/` - Generated test reports and build artifacts.


## Setting Up Android Emulator

To set up the Android Emulator for running the tests, follow these steps:

1. Download and install [Android Studio](https://developer.android.com/studio).
2. Open Android Studio and go to `AVD Manager` (Android Virtual Device Manager) from the toolbar.
3. Click on `Create Virtual Device`.
4. Select a device definition and click `Next`.
5. Choose a system image and click `Next`.
6. Verify the configuration and click `Finish`.
7. Start the emulator by clicking the `Play` button next to the virtual device.

Make sure the emulator is running before executing the tests.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.