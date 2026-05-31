import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}

    func applicationDidBecomeActive(_ application: UIApplication) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.fixWebViewWidth()
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    private func fixWebViewWidth() {
        guard let webView = findWebView(in: self.window?.rootViewController) else { return }

        // Forzar el ancho correcto del WebView
        let screenWidth = UIScreen.main.bounds.width
        var frame = webView.frame
        frame.size.width = screenWidth
        webView.frame = frame

        // Inyectar CSS para prevenir overflow
        let js = """
            (function() {
                var style = document.createElement('style');
                style.innerHTML = 'html, body { overflow-x: hidden !important; max-width: 100vw !important; width: 100% !important; }';
                document.head.appendChild(style);
            })();
        """
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    private func findWebView(in viewController: UIViewController?) -> WKWebView? {
        guard let vc = viewController else { return nil }
        if let found = findWebViewInView(vc.view) { return found }
        for child in vc.children {
            if let found = findWebView(in: child) { return found }
        }
        return nil
    }

    private func findWebViewInView(_ view: UIView) -> WKWebView? {
        if let webView = view as? WKWebView { return webView }
        for subview in view.subviews {
            if let found = findWebViewInView(subview) { return found }
        }
        return nil
    }
}