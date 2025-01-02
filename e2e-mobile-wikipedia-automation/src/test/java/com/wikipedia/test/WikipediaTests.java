package com.wikipedia.test;

import java.net.MalformedURLException;
import java.net.URI;
import java.time.Duration;


import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import com.google.common.collect.ImmutableMap;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;

public class WikipediaTests {
    
    private AppiumDriver driver;
    private WebDriverWait wait;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        System.out.println("Current Working Directory: " + System.getProperty("user.dir"));

        UiAutomator2Options options = new UiAutomator2Options()
            .setDeviceName("emulator-5554")
            .setPlatformName("Android")
            .setPlatformVersion("11.0")
            .setAutomationName("UiAutomator2")
            .setApp("C:\\Users\\rsrivastava\\source\\repos\\soartest\\e2e-mobile-wikipedia-automation\\resources\\WikipediaSample.apk")
            .setNoReset(true)
            .setAutoGrantPermissions(true)
            .setAppWaitActivity("org.wikipedia.main.MainActivity")
            .setAppWaitDuration(Duration.ofSeconds(60)); // Increase wait duration

        System.out.println("Starting Appium Driver...");
        driver = new AndroidDriver(URI.create("http://127.0.0.1:4723/").toURL(), options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        System.out.println("Appium Driver started successfully.");
    }
    

    
    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    // private void scrollDown() {
    //     org.openqa.selenium.Dimension size = driver.manage().window().getSize();
    //     int startX = size.width / 2;
    //     int startY = (int) (size.height * 0.8);
    //     int endY = (int) (size.height * 0.2);
    
    //     driver.executeScript("mobile: swipeGesture", 
    //         ImmutableMap.of(
    //             "left", startX,
    //             "top", startY,
    //             "width", 0,
    //             "height", Math.abs(endY - startY),
    //             "direction", "down",
    //             "percent", 0.8
    //         ));
    // }
    
    private void scrollUp() {
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
                "percent", 0.8
            ));
    }
    
    

    /**
     * Task 1: Navigation and Scrolling
     * Description: Launch provided app then scroll down to the end then click on 
     * three icons My lists, History and nearby and wait for three seconds at every page. 
     * The last step then go back to home by click on browse icon then scroll up to 
     * first topic of app.
     */
    @Test(description = "Task 1 - Navigation through app sections with scrolling")
    public void task1_testNavigationAndScroll() throws InterruptedException {
        // Step 1: Scroll to bottom
        System.out.println("Step 1: Scrolling to bottom of page");
        for (int i = 0; i < 3; i++) {
            scrollUp();
            Thread.sleep(1000);
        }

        // Step 2: Navigate to My lists and wait
        System.out.println("Step 2: Clicking My lists and waiting");
        WebElement myLists = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.accessibilityId("My lists"))
        );
        myLists.click();
        Thread.sleep(3000);
        driver.navigate().back();

        // Step 3: Navigate to History and wait
        System.out.println("Step 3: Clicking History and waiting");
        WebElement history = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.accessibilityId("History"))
        );
        history.click();
        Thread.sleep(3000);
        driver.navigate().back();

        // Step 4: Navigate to Nearby and wait
        System.out.println("Step 4: Clicking Nearby and waiting");
        WebElement nearby = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.accessibilityId("Nearby"))
        );
        nearby.click();
        Thread.sleep(3000);

        // Step 5: Return to home using Browse icon
        System.out.println("Step 5: Returning to home using Browse icon");
        WebElement browse = wait.until(
            ExpectedConditions.presenceOfElementLocated(AppiumBy.accessibilityId("Browse"))
        );
        browse.click();

        // Step 6: Scroll back to top
        System.out.println("Step 6: Scrolling back to top");
        for (int i = 0; i < 3; i++) {
            scrollUp();
            Thread.sleep(1000);
        }
    }

}
