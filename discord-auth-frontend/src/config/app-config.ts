export class AppConfig {
  public static readonly isEmulatorMode = import.meta.env.VITE_IS_EMULATOR_MODE;

  public static get isLocalEmulatorMode() {
    return this.isEmulatorMode === '1';
  }
}
