package com.wikipedia.test;

import java.net.MalformedURLException;
import java.net.URI;
import java.time.Duration;
import java.util.List; // Add this import

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.google.common.collect.ImmutableMap;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;

public class WikipediaTests {

    private AndroidDriver driver;
    private WebDriverWait wait;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        String appPath = System.getProperty("user.dir") + "\\e2e-mobile-wikipedia-automation\\resources\\WikipediaSample.apk";

        UiAutomator2Options options = new UiAutomator2Options()
                .setDeviceName("emulator-5554") // change it to your emulator name using command 'adb devices'
                .setPlatformName("Android")
                .setPlatformVersion("11.0")
                .setAutomationName("UiAutomator2")
                .setApp(appPath)
                .setNoReset(true)
                .setAutoGrantPermissions(true)
                .setAppWaitActivity("org.wikipedia.main.MainActivity")
                .setAppWaitDuration(Duration.ofSeconds(60)); // waiting for the app to open in app

        System.out.println("Starting Appium Driver...");
        driver = new AndroidDriver(URI.create("http://127.0.0.1:4723/").toURL(), options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        System.out.println("Appium Driver started successfully.");

        // Wait for the app to be fully opened
        wait.until(ExpectedConditions.presenceOfElementLocated(AppiumBy.accessibilityId("My lists")));
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            // Uninstall the app
            System.out.println("Uninstalling the app...");
            driver.removeApp("org.wikipedia.alpha");
            System.out.println("App uninstalled successfully.");

            // Quit the driver
            System.out.println("Quitting Appium Driver...");
            driver.quit();
            System.out.println("Appium Driver quit successfully.");

        }
    }

    private void scrollDownUntilFirstTopicVisible() {
        boolean isWidgetVisible = false;
        while (!isWidgetVisible) {
            try {
                WebElement widget = driver.findElement(AppiumBy.id("org.wikipedia.alpha:id/view_list_card_header"));
                isWidgetVisible = widget.isDisplayed();
            } catch (Exception e) {
                org.openqa.selenium.Dimension size = driver.manage().window().getSize();
                int startX = size.width / 2;
                int startY = (int) (size.height * 0.8);
                int endY = (int) (size.height * 0.2);

                driver.executeScript("mobile: swipeGesture",
                        ImmutableMap.of(
                                "left", startX,
                                "top", startY,
                                "width", 0,
                                "height", Math.abs(endY - startY),
                                "direction", "down",
                                "percent", 0.8));
            }
        }
    }

    private void scrollUpUntilImageViewVisible() {
        boolean isImageViewVisible = false;
        while (!isImageViewVisible) {
            try {
                WebElement imageView = driver
                        .findElement(AppiumBy.id("org.wikipedia.alpha:id/view_featured_image_card_image"));
                isImageViewVisible = imageView.isDisplayed();
            } catch (Exception e) {
                org.openqa.selenium.Dimension size = driver.manage().window().getSize();
                int startX = size.width / 2;
                int startY = (int) (size.height * 0.2);
                int endY = (int) (size.height * 0.8);

                driver.executeScript("mobile: swipeGesture",
                        ImmutableMap.of(
                                "left", startX,
                                "top", startY,
                                "width", 0,
                                "height", Math.abs(endY - startY),
                                "direction", "up",
                                "percent", 0.8));
            }
        }
    }

    private void waitForSeconds(int seconds) {
        new WebDriverWait(driver, Duration.ofSeconds(seconds)).until(driver -> true);
    }

    private void navigateAndWait(String accessibilityId, int waitTime) throws InterruptedException {
        WebElement element = wait.until(
                ExpectedConditions.presenceOfElementLocated(AppiumBy.accessibilityId(accessibilityId)));
        element.click();
        waitForSeconds(waitTime);
    }

    @Test(description = "Task 1 - Navigation through app sections with scrolling")
    public void task1_testNavigationAndScroll() throws InterruptedException {
        // Step 1: Scroll to bottom until widget image of the day is visible
        System.out.println("Step 1: Scrolling to bottom of page");
        scrollUpUntilImageViewVisible();

        // Step 2: Navigate to My lists and wait
        System.out.println("Step 2: Clicking My lists and waiting");
        navigateAndWait("My lists", 3);

        // Step 3: Navigate to History and wait
        System.out.println("Step 3: Clicking History and waiting");
        navigateAndWait("History", 3);

        // Step 4: Navigate to Nearby and wait
        System.out.println("Step 4: Clicking Nearby and waiting");
        navigateAndWait("Nearby", 3);
    

        // Step 5: Return to home using Browse icon
        System.out.println("Step 5: Returning to home using Browse icon");
        navigateAndWait("Explore", 0);

        // Step 6: Scroll back to top
        System.out.println("Step 6: Scrolling back to top");
        for (int i = 0; i < 3; i++) {
            scrollDownUntilFirstTopicVisible();
            waitForSeconds(3);
        }
    }

    @Test(description = "Task 2 - Verify search functionality")
    public void task2_testSearchFunctionality() throws InterruptedException {
        // Step 1: Click on the search bar
        System.out.println("Step 1: Clicking on the search bar");
        WebElement searchBar = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.xpath("//android.widget.TextView[@text='Search Wikipedia']"))
        );
        searchBar.click();

        // Step 2: Enter a search term
        System.out.println("Step 2: Entering search term 'New York'");
        WebElement searchInput = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.id("org.wikipedia.alpha:id/search_src_text"))
        );
        searchInput.sendKeys("New York");

        // Step 3: Verify that search results are displayed
        System.out.println("Step 3: Verifying search results are displayed");
        List<WebElement> searchResults = wait.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(AppiumBy.id("org.wikipedia.alpha:id/page_list_item_title"))
        );
        assert !searchResults.isEmpty() : "Search results are not displayed";

        // Optionally, check for specific text in the search results
        boolean isResultFound = searchResults.stream()
            .anyMatch(result -> result.getText().toLowerCase().contains("new york"));
        assert isResultFound : "Expected search result not found";

        // Step 4: Double click on close search button to clear and return to home page
        System.out.println("Step 4: Double clicking on close search button");
        WebElement closeButton = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.accessibilityId("Clear query"))
        );
        closeButton.click();
        closeButton.click();
        waitForSeconds(3);
    }

    @Test(description = "Task 3 - Disable all options in settings and return to home page")
    public void task3_disableAllSettings() throws InterruptedException {
        // Step 1: Click on the menu button
        System.out.println("Step 1: Clicking on the menu button");
        WebElement menuButton = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.xpath("//android.widget.TextView[@content-desc='More options']"))
        );
        menuButton.click();

        // Step 2: Click on settings
        System.out.println("Step 2: Clicking on settings");
        WebElement settingsButton = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.xpath("//android.widget.TextView[@resource-id='org.wikipedia.alpha:id/explore_overflow_settings']"))
        );
        settingsButton.click();

        // Step 3: Disable all toggle buttons
        System.out.println("Step 3: Disabling all toggle buttons");
        for (int i = 0; i < 4; i++) {
            WebElement toggleButton = wait.until(
                ExpectedConditions.presenceOfElementLocated(AppiumBy.xpath("(//android.widget.Switch[@resource-id='org.wikipedia.alpha:id/switchWidget'])[" + (i + 1) + "]"))
            );
            if (toggleButton.getAttribute("checked").equals("true")) {
                toggleButton.click();
            }
        }

        // Step 4: Go back to home page
        System.out.println("Step 4: Returning to home page");
        driver.navigate().back();
        waitForSeconds(3);// these waits are only to show that expected action is performed and can be seen by someone who is executing the test
    }
}
