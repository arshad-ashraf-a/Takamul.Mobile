import { DirectionsMapDirective } from '../components/direction-map';
import { MapPage } from '../pages/map/map';
import { ProfilePage } from '../pages/profile/profile';
import { NavPushAnchor } from 'ionic-angular/umd';
import { TermsPage } from '../pages/terms/terms';
import { HowItWorksPage } from '../pages/how-it-works/how-it-works';
import { FaqPage } from '../pages/faq/faq';
import { SettingPage } from '../pages/setting/setting';
import { PopoverMenuPage } from '../pages/popover-menu/popover-menu';
import { FilterPipe } from '../pipes/filter';
import { TranslateLoader, TranslateModule, TranslateStaticLoader } from 'ng2-translate';
import { TruncatePipe } from '../pipes/truncate';
import { NewChat } from '../pages/new-chat/new-chat';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TanCalendar } from '../components/tan-calendar/tan-calendar';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { AdminPage } from '../pages/admin/admin';
import { TicketsPage } from '../pages/tickets/tickets';
import { EventsPage } from '../pages/events/events';
import { EventDetails } from '../pages/event-details/event-details';
import { NewsPage } from '../pages/news/news';
import { NewsModalPage } from '../pages/news-modal/news-modal';
import { ChatModalPage } from '../pages/chat-modal/chat-modal';


import {Http, HttpModule} from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Toast } from '@ionic-native/toast';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileChooser } from '@ionic-native/file-chooser';
import { Push } from '@ionic-native/push';
import { Clipboard } from '@ionic-native/clipboard';
import { Geolocation } from '@ionic-native/geolocation';

import { LoaderService } from '../providers/loader-service';
import { ExceptionProvider } from '../providers/exception';
import { UtilProvider } from '../providers/util-provider';
import { AppData } from '../providers/appdata';
import { CommonStorage } from '../providers/common-storage';
import { ApiFactory } from '../providers/api-factory';
import { Authentication } from '../providers/authentication';
import { DateService } from '../providers/date-service';

import { Keyboard } from '@ionic-native/keyboard';


import { AgmCoreModule } from 'angular2-google-maps/core';
import { Device } from '@ionic-native/device';
import { Badge } from '@ionic-native/badge';
import { BackgroundMode } from '@ionic-native/background-mode';

export function translateLoaderService(http:any){
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
  declarations: [
    TanCalendar,
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    AdminPage,
    TicketsPage,
    EventsPage,
    NewsPage,
    NewsModalPage,
    ChatModalPage,
    NewChat,
    TruncatePipe, 
    EventDetails,
    FilterPipe,
    PopoverMenuPage,
    SettingPage,
    FaqPage,
    HowItWorksPage,
    TermsPage,
    ProfilePage,
    MapPage,
    DirectionsMapDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDP_FdzIbc5c50ZNgB7atas1SJGSjsmRaA',
      libraries: ["places"]
    }),
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: translateLoaderService,
        deps: [Http] 
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    AdminPage,
    TicketsPage,
    EventsPage,
    NewsPage,
    NewsModalPage,
    ChatModalPage,
    NewChat,
    EventDetails,
    PopoverMenuPage,
    SettingPage,
    FaqPage,
    HowItWorksPage,
    TermsPage,
    ProfilePage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Transfer,
    Camera,
    FilePath,
    Toast,
    Network,
    SocialSharing,
    FileChooser,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiFactory,
    Authentication,
    CommonStorage,
    AppData,
    UtilProvider,
    ExceptionProvider,
    LoaderService,
    DateService,
    Push,
    Device,
    Badge,
    BackgroundMode,
    Clipboard,
    Geolocation
  ]
})
export class AppModule {}