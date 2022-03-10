import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private subject: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private populateChildComponentsubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private rollbackChangesSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private updateReportTypeToReportType: BehaviorSubject<any> = new BehaviorSubject<any>('');
  private updateReportTypeToReportTypeSidebar: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor() {}

  /**
   * Sends the message to a component.
   *
   * @param      {Any}  message  The message
   */
  public sendMessage(message: any) {
    this.subject.next(message);
  }

  /**
   * Clears the message if needed.
   *
   */
  public clearMessage() {
    this.subject.next('');
  }

  /**
   * Gets the message.
   *
   * @return     {Observable}  The message.
   */
  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  /**
   * Sends the message to a component.
   *
   * @param      {Any}  message  The message
   */
  public sendPopulateChildComponentMessage(message: any) {
    this.populateChildComponentsubject.next(message);
  }

  /**
   * Clears the message if needed.
   *
   */
  public clearPopulateChildComponentMessage() {
    this.populateChildComponentsubject.next('');
  }

  /**
   * Gets the message.
   *
   * @return     {Observable}  The message.
   */
  public getPopulateChildComponentMessage(): Observable<any> {
    return this.populateChildComponentsubject.asObservable();
  }

  /**
   * Sends the message to a component.
   *
   * @param      {Any}  message  The message
   */
  public sendRollbackChangesMessage(message: any) {
    this.rollbackChangesSubject.next(message);
  }

  /**
   * Clears the message if needed.
   *
   */
  public clearRollbackChangesMessage() {
    this.rollbackChangesSubject.next('');
  }

  /**
   * Gets the message.
   *
   * @return     {Observable}  The message.
   */
  public getRollbackChangesMessage(): Observable<any> {
    return this.rollbackChangesSubject.asObservable();
  }

  /**
   * Sends the message to a component.
   *
   * @param      {Any}  message  The message
   */
  public sendUpdateReportTypeMessageToReportType(message: any) {
    this.updateReportTypeToReportType.next(message);
  }

  /**
   * Sends the message to a component.
   *
   * @param      {Any}  message  The message
   */
  public sendUpdateReportTypeMessageToReportTypeSidebar(message: any) {
    this.updateReportTypeToReportTypeSidebar.next(message);
  }

  /**
   * Clears the message if needed.
   *
   */
  public clearUpdateReportTypeMessageToReportType() {
    this.updateReportTypeToReportType.next('');
  }

  /**
   * Clears the message if needed.
   *
   */
  public clearUpdateReportTypeMessageToReportTypeSidebar() {
    this.updateReportTypeToReportTypeSidebar.next('');
  }

  /**
   * Gets the message.
   *
   * @return     {Observable}  The message.
   */
  public getUpdateReportTypeMessageToReportType(): Observable<any> {
    return this.updateReportTypeToReportType.asObservable();
  }

  /**
   * Gets the message.
   *
   * @return     {Observable}  The message.
   */
  public getUpdateReportTypeMessageToReportTypeSidebar(): Observable<any> {
    return this.updateReportTypeToReportTypeSidebar.asObservable();
  }
}
