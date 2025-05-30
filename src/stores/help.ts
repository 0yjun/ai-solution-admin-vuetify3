// src/stores/help.ts
import { useCreate } from '@/hooks/useCreate'
import { useDelete } from '@/hooks/useDelete'
import { useSearch } from '@/hooks/useSearch'
import { useUpdate } from '@/hooks/useUpdate'
import type { HelpCreateRequestDto, HelpDto } from '@/types/api/help.dto'
import { defineStore } from 'pinia'

export const useHelpStore = defineStore('help', () => {
  // ──────────────────────────────────────────────────────────────
  // 1) 검색(Read) 훅
  const { data: help, fetch, isLoading:isFetchLoading } = useSearch<HelpDto>('/api/helps')

  // ──────────────────────────────────────────────────────────────
  // 2) 원시 CRUD mutation 훅 (순수 API 호출용)
  const {
    mutate: createOnly,
    isSuccess: creating,
    errorMessage: createError,
  } = useCreate<HelpCreateRequestDto>('/api/helps')

  const {
    mutate: updateOnly,
    isSuccess: updating,
    errorMessage: updateError,
  } = useUpdate<HelpDto>('/api/helps')

  const {
    mutate: deleteOnly,
    isSuccess: deleting,
    errorMessage: deleteError,
  } = useDelete('/api/helps')

  const {
    mutate: deleteImageOnly,
    isSuccess: deletingImage,
    errorMessage: imageDeleteError,
  } = useDelete('/api/helps')

  const {
    mutate: createhelpImageOnly,
    isSuccess: helpImageCreating,
    errorMessage: helpImageCreateError,
  } = useCreate<FormData>('/api/helps')

  const {
    mutate: updateHelpImageOnly,
    isSuccess: helpImageupdating,
    errorMessage: helpImageUpdateError,
  } = useUpdate<FormData>('/api/helps')

  // ──────────────────────────────────────────────────────────────
  // 3) 조회 액션 래퍼
  async function loadHelp (menuId: number) {
    await fetch({ params: { menuId } })
  }

  // ──────────────────────────────────────────────────────────────
  // 4) orchestration 액션: 오류 출력 + 갱신 포함
  async function createAndRefresh (payload: HelpCreateRequestDto, menuId: number) {
    await createOnly({ payload })
    if (creating.value) {
      await loadHelp(menuId)
    } else {
      alert(createError)
      console.error(createError)
    }
  }

  async function updateAndRefresh (payload: HelpDto, menuId: number) {
    await updateOnly({ payload, pathVariable: payload.helpId })
    if (updating.value) {
      await loadHelp(menuId)
    } else {
      alert(updateError)
      console.error(updateError)
    }
  }

  async function deleteAndRefresh (helpId: number, menuId: number) {
    await deleteOnly(helpId)
    if (deleting.value) {
      await loadHelp(menuId)
    } else {
      alert(deleteError)
      console.error(deleteError)
    }
  }

  async function deleteImageAndRefresh (helpId: number, imageId: number, menuId: number) {
    // DELETE /api/helps/{helpId}/images/{imageId}
    await deleteImageOnly(`${helpId}/images/${imageId}`)
    if (!deletingImage.value) {
      alert(imageDeleteError.value)
      console.error(imageDeleteError.value)
    }
    await loadHelp(menuId)
  }

  async function createhelpImageAndRefresh (payload: FormData, helpId:number, menuId: number) {
    await createhelpImageOnly({ payload, pathVariable: helpId, config: { 'headers':{ 'Content-Type': 'multipart/form-data' } } })
    if (!helpImageCreating.value) {
      alert(helpImageCreateError.value)
      console.error(helpImageCreateError.value)
    }
    await loadHelp(menuId)
  }


  async function updatehelpImageAndRefresh (payload: FormData, helpId:number, helpImageId: number, menuId: number) {
    await updateHelpImageOnly({ payload, pathVariable: `${helpId}/images/${helpImageId}`, config: { 'headers':{ 'Content-Type': 'multipart/form-data' } } })
    if (!helpImageupdating.value) {
      alert(helpImageUpdateError.value)
      console.error(helpImageUpdateError.value)
    }
    await loadHelp(menuId)
  }

  // ──────────────────────────────────────────────────────────────
  // 5) 스토어 공개 API
  return {
    // state
    help,
    isFetchLoading,
    creating,
    updating,
    deleting,
    deletingImage,
    createError,
    updateError,
    deleteError,
    imageDeleteError,

    // raw mutations (순수 CUD)
    createOnly,
    updateOnly,
    deleteOnly,
    deleteImageOnly,
    createhelpImageOnly,

    // orchestration methods
    loadHelp,
    createAndRefresh,
    updateAndRefresh,
    deleteAndRefresh,
    deleteImageAndRefresh,

    createhelpImageAndRefresh,
    updatehelpImageAndRefresh,
  }
})
