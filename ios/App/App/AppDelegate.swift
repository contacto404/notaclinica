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
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            self.disableHorizontalScroll(in: self.window?.rootViewController)
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    private func disableHorizontalScroll(in viewController: UIViewController?) {
        guard let vc = viewController else { return }
        for child in vc.children {
            disableHorizontalScroll(in: child)
        }
        disableHorizontalScrollInView(vc.view)
    }

    private func disableHorizontalScrollInView(_ view: UIView) {
        if let webView = view as? WKWebView {
            webView.scrollView.showsHorizontalScrollIndicator = false
            webView.scrollView.alwaysBounceHorizontal = false
            webView.scrollView.contentInsetAdjustmentBehavior = .never

            // Forzar el contentSize al ancho de la pantalla
            let screenWidth = UIScreen.main.bounds.width
            if webView.scrollView.contentSize.width > screenWidth {
                webView.scrollView.contentSize = CGSize(
                    width: screenWidth,
                    height: webView.scrollView.contentSize.height
                )
            }
        }
        for subview in view.subviews {
            disableHorizontalScrollInView(subview)
        }
    }
}
