let offline=false, scanTI=null, scanSecs=0, obSc=false, laterOpen=false;
let undoTI=null, undoSecs=10;
let iq={hyd:18,alu:45,bolt:340,wire:250,oring:820};
let incomingQty=1; // ★ v5: 입고 수량 상태

function go(id,label){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  ['f1','f2','f3'].forEach((k,i)=>{document.querySelectorAll('.si')[i].classList.toggle('active',k===id);});
  document.getElementById('panel-'+id).classList.add('active');
  document.getElementById('bc-current').textContent=label||id;
}
function toast(msg,type='tok',dur=3000){
  const w=document.getElementById('tw'),t=document.createElement('div');
  t.className='toast '+type;
  const ic=type==='tok'?'circle-check':type==='terr'?'alert-circle':'alert-triangle';
  t.innerHTML=`<i class="ti ti-${ic}" style="font-size:16px;flex-shrink:0"></i>${msg}`;
  w.appendChild(t);setTimeout(()=>t.remove(),dur);
}
function toggleOffline(){
  offline=!offline;
  ['ob1','ob2'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.toggle('show',offline);});
  const sp=document.getElementById('status-pill');
  if(offline){sp.className='status-pill offline';sp.innerHTML='<i class="ti ti-wifi-off" style="font-size:12px"></i>오프라인';toast('인터넷 연결이 끊겼어요. 임시 저장 중이에요.','twarn');}
  else{sp.className='status-pill online';sp.innerHTML='<i class="ti ti-wifi" style="font-size:12px"></i>연결됨';toast('다시 연결됐어요! 임시 저장 2건이 업로드됐어요.','tok',4000);}
}

/* ★ v5 — CCCCC 잠금 카드 shake 피드백 */
function shakeLockedCard(){
  const card=document.getElementById('card-ccc');
  card.classList.remove('shake');
  void card.offsetWidth; // reflow
  card.classList.add('shake');
  setTimeout(()=>card.classList.remove('shake'),400);
  toast('BBBBB를 먼저 완료해야 열려요.','twarn');
}

/* ★ v5 — 입고 수량 스테퍼 */
function changeQty(d){
  incomingQty=Math.max(1, incomingQty+d);
  document.getElementById('qty-val').textContent=incomingQty;
  const minusBtn=document.getElementById('qty-minus');
  if(minusBtn) minusBtn.disabled = incomingQty<=1;
  updateCfBtn();
}
function updateCfBtn(){
  const btn=document.getElementById('cfbtn');
  if(!btn)return;
  if(incomingQty>=1){
    btn.disabled=false;btn.className='btn bok';
    btn.innerHTML='<i class="ti ti-check"></i>맞아요, 입고 기록할게요';
  } else {
    btn.disabled=true;btn.className='btn bok btn-disabled';
    btn.innerHTML='<i class="ti ti-check"></i>수량을 1 이상 입력해주세요';
  }
}

/* ★ v5 — 주문 메모 조건부 활성 */
function onMemoInput(ta){
  const btn=document.getElementById('smemo-btn');
  const hint=document.getElementById('memo-hint');
  const isEmpty=ta.value.trim().length===0;
  ta.className=isEmpty?'required-empty':'has-content';
  if(btn&&!btn.classList.contains('btn-saved')){
    if(isEmpty){btn.disabled=true;btn.className='btn bdan btn-disabled';}
    else{btn.disabled=false;btn.className='btn bdan';}
  }
  if(hint) hint.classList.toggle('show',isEmpty);
}

/* ★ v5 — 온보딩 자재 이름 실시간 유효성 */
function onObNameInput(input){
  const btn=document.getElementById('ob-next-btn');
  const err=document.getElementById('ob-nerr');
  const isEmpty=input.value.trim().length===0;
  if(btn){
    if(isEmpty){btn.disabled=true;btn.className='btn bp btn-disabled';}
    else{btn.disabled=false;btn.className='btn bp';}
  }
  if(err) err.classList.toggle('show',isEmpty);
}

/* FLOW 1 스캔 */
function startScanTimer(){
  scanSecs=0;const el=document.getElementById('sa-timer');
  scanTI=setInterval(()=>{scanSecs++;
    if(scanSecs===3){el.textContent='아직 찾고 있어요… 밝은 곳에서 가까이 대주세요.';document.getElementById('sa-stxt').textContent='계속 찾는 중… ('+scanSecs+'초)';}
    else if(scanSecs===5){el.textContent='잘 안 되나요? 아래 직접 입력 버튼을 눌러주세요.';document.getElementById('alt-cta').classList.add('show');}
  },1000);
}
function stopScanTimer(){clearInterval(scanTI);const el=document.getElementById('sa-timer');if(el)el.textContent='';}
function simOk(){
  stopScanTimer();
  const sa=document.getElementById('sa'),st=document.getElementById('sa-stat');
  document.getElementById('sa-ic').className='sa-icon ti ti-scan';
  sa.className='scan-area scanning';st.className='sstat sstat-scan';
  document.getElementById('sa-stxt').textContent='찾는 중…';
  document.getElementById('alt-cta').classList.remove('show');
  startScanTimer();
  setTimeout(()=>{
    stopScanTimer();
    document.getElementById('ic-name').textContent='알루미늄 판재 2T';
    document.getElementById('ic-stock').textContent='45 EA';
    document.getElementById('ic-time').textContent='오전 10:'+String(new Date().getMinutes()).padStart(2,'0');
    sa.className='scan-area scan-ok';document.getElementById('sa-ic').className='sa-icon ti ti-circle-check';
    document.getElementById('sa-title').textContent='찾았어요!';document.getElementById('sa-sub').textContent='알루미늄 판재 2T';
    st.className='sstat sstat-ok';document.getElementById('sa-stxt').textContent='알루미늄 판재 2T를 찾았어요.';
    // ★ v5: 수량 입력 필드 노출
    incomingQty=1;
    document.getElementById('qty-val').textContent='1';
    document.getElementById('qty-unit').textContent='EA';
    const minusBtn=document.getElementById('qty-minus');if(minusBtn)minusBtn.disabled=true;
    document.getElementById('qty-row').classList.add('show');
    document.getElementById('scan-cta').style.display='flex';
    updateCfBtn();
  },1400);
}
function simFail(){
  stopScanTimer();
  const sa=document.getElementById('sa'),st=document.getElementById('sa-stat');
  sa.className='scan-area scanning';document.getElementById('sa-ic').className='sa-icon ti ti-scan';
  st.className='sstat sstat-scan';document.getElementById('sa-stxt').textContent='찾는 중…';
  startScanTimer();
  setTimeout(()=>{
    stopScanTimer();sa.className='scan-area scan-err';
    document.getElementById('sa-ic').className='sa-icon ti ti-x';
    document.getElementById('sa-title').textContent='바코드를 못 찾았어요.';
    document.getElementById('sa-sub').textContent='아래에서 이름으로 직접 입력해주세요.';
    st.className='sstat sstat-err';document.getElementById('sa-stxt').textContent='바코드를 못 찾았어요.';
    document.getElementById('alt-cta').classList.add('show');
    document.getElementById('qty-row').classList.remove('show');
    document.getElementById('scan-cta').style.display='none';
    toast('바코드 인식에 실패했어요.','terr');
  },1800);
}
function exitScan(){
  stopScanTimer();
  const sa=document.getElementById('sa'),st=document.getElementById('sa-stat');
  sa.className='scan-area';document.getElementById('sa-ic').className='sa-icon ti ti-scan';
  document.getElementById('sa-title').textContent='카메라로 바코드를 찍어주세요.';
  document.getElementById('sa-sub').textContent='여기를 누르면 카메라가 켜져요';
  st.className='sstat sstat-idle';document.getElementById('sa-stxt').textContent='스캔이 중단됐어요.';
  document.getElementById('alt-cta').classList.remove('show');
  document.getElementById('qty-row').classList.remove('show');
  document.getElementById('scan-cta').style.display='none';
  toast('스캔을 중단했어요.','twarn');
}
function focusScan(){document.querySelector('.card').scrollIntoView({behavior:'smooth',block:'center'});}
function confirmIncoming(){
  if(incomingQty<1){toast('수량을 1 이상 입력해주세요.','terr');return;}
  const btn=document.getElementById('cfbtn');
  btn.innerHTML='<div class="spinner"></div>저장 중…';btn.classList.add('btn-saving');
  setTimeout(()=>{
    btn.style.display='none';
    document.getElementById('scan-cta').style.display='none';
    document.getElementById('qty-row').classList.remove('show');
    const row=document.querySelector('#stbody tr[data-id="alu"]');if(row){row.classList.add('flash');setTimeout(()=>row.classList.remove('flash'),1400);}
    const ps=document.querySelectorAll('.ps');
    ps[1].classList.remove('active');ps[1].classList.add('done');
    ps[1].querySelector('.pn').innerHTML='<i class="ti ti-check" style="font-size:11px"></i>';
    ps[1].querySelector('.plabel').textContent='BBBBB 완료';
    ps[2].classList.add('active');
    showUndo('BBBBB 알루미늄 판재 '+incomingQty+'EA 입고됐어요.');
  },900);
}
function showUndo(msg){
  const ut=document.getElementById('undo-t');document.getElementById('ut-msg').textContent=msg;
  ut.classList.add('show');undoSecs=10;
  document.getElementById('ut-secs').textContent=undoSecs;document.getElementById('ut-fill').style.width='100%';
  clearInterval(undoTI);
  undoTI=setInterval(()=>{
    undoSecs--;document.getElementById('ut-secs').textContent=undoSecs;
    document.getElementById('ut-fill').style.width=(undoSecs/10*100)+'%';
    if(undoSecs<=0){clearInterval(undoTI);ut.classList.remove('show');toast('입고 기록이 저장됐어요. 재고가 업데이트됐어요.','tok',4000);}
  },1000);
}
function undoIncoming(){
  clearInterval(undoTI);document.getElementById('undo-t').classList.remove('show');
  const ps=document.querySelectorAll('.ps');
  ps[1].classList.remove('done');ps[1].classList.add('active');
  ps[1].querySelector('.pn').textContent='2';ps[1].querySelector('.plabel').textContent='BBBBB 진행 중';
  ps[2].classList.remove('active');
  incomingQty=1;
  document.getElementById('ic-name').textContent='—';document.getElementById('ic-stock').textContent='—';document.getElementById('ic-time').textContent='—';
  const sa=document.getElementById('sa'),st=document.getElementById('sa-stat');
  sa.className='scan-area scanning';document.getElementById('sa-ic').className='sa-icon ti ti-scan';
  document.getElementById('sa-title').textContent='카메라로 바코드를 찍어주세요.';document.getElementById('sa-sub').textContent='여기를 누르면 카메라가 켜져요';
  st.className='sstat sstat-scan';document.getElementById('sa-stxt').textContent='찾는 중…';
  const cfbtn=document.getElementById('cfbtn');
  cfbtn.innerHTML='<i class="ti ti-check"></i>맞아요, 입고 기록할게요';
  cfbtn.style.display='flex';cfbtn.disabled=false;cfbtn.className='btn bok';
  cfbtn.classList.remove('btn-saving','btn-saved');
  toast('입고 기록을 취소했어요. 다시 확인해주세요.','twarn');
}
function dismissUndo(){clearInterval(undoTI);document.getElementById('undo-t').classList.remove('show');toast('입고 기록이 저장됐어요.','tok');}

/* FLOW 2 인라인 수정 */
function toggleIE(row){
  if(event&&(event.target.tagName==='BUTTON'||event.target.closest('button')))return;
  const id=row.dataset.id;const ie=document.getElementById('ie-'+id);
  const isOpen=ie.classList.contains('open');
  document.querySelectorAll('.ie-row').forEach(r=>r.classList.remove('open'));
  document.querySelectorAll('.del-confirm').forEach(d=>d.classList.remove('show'));
  if(!isOpen)ie.classList.add('open');
}
function closeIE(id){document.getElementById('ie-'+id).classList.remove('open');document.getElementById('dc-'+id).classList.remove('show');}
function stepQ(id,d){
  // ★ v5: 최솟값 1 강제
  iq[id]=Math.max(1, iq[id]+d);
  document.getElementById('q-'+id).textContent=iq[id];
}
function saveIE(id){
  const row=document.querySelector(`tr[data-id="${id}"]`);
  const unit=row.dataset.unit;
  row.querySelector('.stock-cell').textContent=iq[id]+' '+unit;
  closeIE(id);row.classList.add('flash');setTimeout(()=>row.classList.remove('flash'),1400);
  toast('재고 수량이 '+iq[id]+' '+unit+'으로 수정됐어요.','tok');
}
function hideRow(id){
  closeIE(id);
  document.querySelector(`tr[data-id="${id}"]`).style.display='none';
  document.getElementById('ie-'+id).style.display='none';
  toast('목록에서 숨겼어요. 설정에서 다시 보이게 할 수 있어요.','twarn',4000);
}
function showDC(id){document.getElementById('dc-'+id).classList.add('show');}
function hideDC(id){document.getElementById('dc-'+id).classList.remove('show');}
function delRow(id){document.querySelector(`tr[data-id="${id}"]`).remove();document.getElementById('ie-'+id).remove();toast('자재가 완전히 삭제됐어요.','terr');}
function filterTbl(v){
  const rows=document.querySelectorAll('#stbody tr.data-row');let vis=0;
  rows.forEach(r=>{const show=!v||r.dataset.name.includes(v);r.style.display=show?'':'none';if(show)vis++;});
  const em=document.getElementById('tbl-empty'),tb=document.getElementById('stbl');
  if(vis===0&&v){em.style.display='block';tb.style.display='none';document.getElementById('empty-msg').textContent='"'+v+'"(으)로 검색했는데 없네요.';document.getElementById('tcount').textContent='검색 결과 없음';}
  else{em.style.display='none';tb.style.display='';document.getElementById('tcount').textContent=v?vis+'개 검색됨':'전체 24개 자재';}
}
function resetSearch(){document.querySelector('.sw input').value='';filterTbl('');}
function openDP(){document.getElementById('dpanel').classList.add('open');document.getElementById('dpanel').scrollIntoView({behavior:'smooth',block:'nearest'});}
function closeDP(){document.getElementById('dpanel').classList.remove('open');}
function saveMemo(){
  // ★ v5: 빈 메모 저장 차단 (이중 방어)
  const ta=document.getElementById('omemo');
  if(!ta||ta.value.trim().length===0){toast('주문 내용을 먼저 입력해주세요.','terr');return;}
  const btn=document.getElementById('smemo-btn');
  btn.innerHTML='<div class="spinner"></div>저장 중…';btn.classList.add('btn-saving');
  setTimeout(()=>{
    btn.innerHTML='<i class="ti ti-circle-check"></i>저장 완료';btn.classList.remove('btn-saving');btn.classList.add('btn-saved');
    document.getElementById('memo-act').classList.add('show');
    toast('주문 메모가 저장됐어요.','tok');
  },800);
}
function editMemo(){
  const btn=document.getElementById('smemo-btn');btn.innerHTML='<i class="ti ti-pencil"></i>주문 메모 저장하기';
  btn.classList.remove('btn-saved');btn.disabled=false;
  document.getElementById('memo-act').classList.remove('show');
  const ta=document.getElementById('omemo');ta.focus();
  onMemoInput(ta); // 현재 값으로 버튼 상태 재평가
  toast('메모를 수정할 수 있어요.','twarn');
}
function showMemoDC(){document.getElementById('memo-dc').classList.add('show');}
function hideMemoDC(){document.getElementById('memo-dc').classList.remove('show');}
function deleteMemo(){
  const btn=document.getElementById('smemo-btn');btn.innerHTML='<i class="ti ti-pencil"></i>주문 메모 저장하기';
  btn.classList.remove('btn-saved');document.getElementById('memo-act').classList.remove('show');
  document.getElementById('memo-dc').classList.remove('show');
  const ta=document.getElementById('omemo');ta.value='';ta.className='required-empty';
  btn.disabled=true;btn.className='btn bdan btn-disabled';
  document.getElementById('memo-hint').classList.add('show');
  toast('주문 메모가 삭제됐어요.','terr');
}

/* FLOW 3 온보딩 */
function obGo(n){
  // ★ v5: 자재 이름 빈 칸이면 step2로 못 감
  if(n===2){
    const nm=document.getElementById('ob-nm');
    if(!nm||nm.value.trim().length===0){
      document.getElementById('ob-nerr').classList.add('show');
      nm.focus();nm.classList.add('err');
      toast('자재 이름 칸이 비어 있어요.','terr');return;
    }
  }
  [1,2,3].forEach(i=>{const s=document.getElementById('step'+i);if(s)s.style.display=i===n?'block':'none';});
  if(n===1){document.getElementById('step1').style.display='block';document.getElementById('step2').style.display='none';document.getElementById('step3').style.display='none';}
  document.querySelectorAll('.obs').forEach((s,i)=>{s.classList.remove('done','active');if(i+1<n)s.classList.add('done');if(i+1===n)s.classList.add('active');});
}
function obBack(){document.getElementById('saved-n').classList.add('show');obGo(1);}
function toggleLater(){
  laterOpen=!laterOpen;document.getElementById('laterf').style.display=laterOpen?'flex':'none';
  document.getElementById('later-ic').className=laterOpen?'ti ti-chevron-up':'ti ti-chevron-down';
}
function obScan(){
  if(obSc)return;obSc=true;
  const sa=document.getElementById('ob-sa'),ic=document.getElementById('ob-saic');
  const ti=document.getElementById('ob-satitle'),su=document.getElementById('ob-sasub'),st=document.getElementById('ob-sastat');
  sa.className='obscan scanning';ic.className='ti ti-loader-2';ti.textContent='찾는 중…';su.textContent='잠깐만요';
  st.className='sstat sstat-scan';st.innerHTML='<div class="dotl"><span></span><span></span><span></span></div><span>바코드를 인식하고 있어요…</span>';
  setTimeout(()=>{
    sa.className='obscan ok';ic.className='ti ti-circle-check';ti.textContent='찾았어요!';su.textContent='SUS304 볼트 M8';
    st.className='sstat sstat-ok';st.innerHTML='<i class="ti ti-circle-check" style="font-size:14px"></i><span>MAT-2024-00101 인식됐어요</span>';
    document.getElementById('ob-cf').classList.add('show');document.getElementById('skipn').classList.remove('show');obSc=false;
  },1400);
}
function obRetry(){
  document.getElementById('ob-sa').className='obscan';document.getElementById('ob-saic').className='ti ti-scan';
  document.getElementById('ob-satitle').textContent='여기를 눌러서 바코드를 찍어주세요';
  document.getElementById('ob-sasub').textContent='카메라가 켜집니다';
  const st=document.getElementById('ob-sastat');st.className='sstat sstat-idle';
  st.innerHTML='<i class="ti ti-info-circle"></i><span>준비됐어요. 위 버튼을 눌러주세요.</span>';
  document.getElementById('ob-cf').classList.remove('show');obSc=false;
}
function obSkip(){document.getElementById('skipn').classList.add('show');document.getElementById('ob-bcr').textContent='연결 안 됨 (설정에서 나중에 추가 가능)';obGo(3);}

/* 초기화 — 저장 버튼 상태 세팅 */
window.addEventListener('DOMContentLoaded',()=>{
  // 주문 메모 초기값 있으므로 버튼 활성
  const ta=document.getElementById('omemo');
  if(ta&&ta.value.trim().length>0){
    const btn=document.getElementById('smemo-btn');
    if(btn){btn.disabled=false;btn.className='btn bdan';}
    ta.className='has-content';
  }
});

